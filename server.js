import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import promClient from "prom-client"; // Prometheus client library
import os from "os";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

//WINSTON loki
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  ...,
  transports: [
    new LokiTransport({
      host: "http://34.199.70.236:3100"
    })
  ]
  ...
};
const logger = createLogger(options);

// ------------DB & AuthenticateUser------------ //
import connectDB from "./db/connect.js";
import morgan from "morgan";

// ------------Routers------------ //
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRouter.js";

// ------------middleware------------ //
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

// ------------API Routes------------ //
app.get("/api/v1", (req, res) => {
  res.json("Welcome!");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// direct to index.html for react-router after the 2 routes above
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    // only connect to server if successfully-connected to DB
    app.listen(port, () =>
      console.log(`Server is listening on http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
