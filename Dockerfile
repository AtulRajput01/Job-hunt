# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Copy the .env file to the container
COPY .env .env

# Expose the port the app will run on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
