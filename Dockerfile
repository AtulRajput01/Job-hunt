# Use a smaller Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application files into the container, excluding unnecessary files
COPY . .


# Expose the port the app will run on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
