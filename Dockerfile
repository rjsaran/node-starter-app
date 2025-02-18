# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /www-data

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your application runs on
EXPOSE 4000

CMD ["npm", "run", "start"]