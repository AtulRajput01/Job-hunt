import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import promClient from "prom-client"; // Prometheus client library
import os from "os";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// WINSTON LOKI SETUP
import { createLogger, format, transports } from "winston";
import LokiTransport from "winston-loki";

// Configure Winston logger to use Loki transport
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new LokiTransport({
      host: "http://34.199.70.236:3100",
      labels: { job: "my-backend-server" }, // Add labels to logs to distinguish different apps
      json: true,
      level: "info", // Log both info and error levels
      replaceTimestamp: true,
    })
  ]
});

// ------------DB & AuthenticateUser------------ //
import connectDB from "./db/connect.js";
import morgan from "morgan";

// ------------Routers------------ //
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRouter.js";

// ------------Middleware------------ //
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";
import authenticateUser from "./middlewares/auth.js";

// ------------Security Packages------------ //
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// ------------Production------------ //
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// -------------------------------------------------------------- //

const __dirname = dirname(fileURLToPath(import.meta.url)); // because we're using ES6-modules not common.js

app.use(express.static(path.resolve(__dirname, "./client/build"))); // static assets

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json()); // make json-data available
app.use(helmet()); // secure Express-app by setting various HTTP headers
app.use(xss()); // sanitize user input coming from POST body, GET queries, and URL params
app.use(mongoSanitize()); // Sanitizes user-supplied data to prevent MongoDB Operator Injection

// ------------ Metrics Setup ------------ //
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 }); // collect default metrics like CPU usage

// Create a Registry for custom metrics
const register = new promClient.Registry();
register.setDefaultLabels({
  app: 'my-backend-server',
});
promClient.collectDefaultMetrics({ register });

// Create custom metrics for HTTP request duration
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 300, 500, 750, 1000, 2000], // Bucket sizes for response time
});

// Register the metric
register.registerMetric(httpRequestDurationMicroseconds);

// Expose the /metrics endpoint for Prometheus to scrape metrics
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Middleware to measure request duration
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInMs = seconds * 1000 + nanoseconds / 1e6;

    // Use req.route?.path to handle cases where req.route might be undefined
    const route = req.route?.path || req.url;

    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(durationInMs);
  });
  next();
});

// ------------ API Routes with Logging ------------ //
app.get("/api/v1", (req, res) => {
  logger.info("GET /api/v1 - Welcome route hit", { method: req.method, route: req.route?.path });
  res.json("Welcome!");
});

app.use("/api/v1/auth", (req, res, next) => {
  logger.info(`Request to auth route: ${req.method} ${req.originalUrl}`);
  next();
}, authRouter);

app.use("/api/v1/jobs", authenticateUser, (req, res, next) => {
  logger.info(`Request to jobs route: ${req.method} ${req.originalUrl}`);
  next();
}, jobsRouter);

// Catch-all route for React-Router SPA
app.get("*", (req, res) => {
  logger.info("Serving index.html for React routes");
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// ------------ Error Logging Middleware ------------ //
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    method: req.method,
    route: req.route?.path || req.url,
    status: res.statusCode,
    stack: err.stack
  });
  next(err); // Pass error to next middleware (error handler)
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// ------------ Start Server ------------ //
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      logger.info(`Server is listening on http://localhost:${port}`);
      console.log(`Server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, { stack: error.stack });
    console.log(error);
  }
};

start();
