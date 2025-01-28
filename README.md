# Node.JS Starter App

# Project Overview

This project is built using TypeScript and follows a modular architecture. It uses Inversify for dependency injection, TypeORM for database interactions, Jest for unit testing.

## Project Structure

The project is organized into the following main directories:

### `app/`

This folder contains the main application logic:

- **controllers/**: Controllers that handle incoming HTTP requests and return responses.
- **dtos/**: Data Transfer Objects used for validation and structuring data.
- **entities/**: TypeORM entities that define the database schema.
- **interfaces/**: Interfaces that define the structure of services.
- **serializers/**: Serializer used for HTTP response.
- **services/**: Services that contain the business logic.
- **tests/**: Unit tests specific to the module.

### `config/`

- **index.ts**: Exports the appropriate configuration based on the current environment. The application reads configuration settings from environment variables. Example environment variables can be found in the `.env.example` file. Create a `.env` file in the root directory and populate it with your specific settings.

### `core/`

This folder contains core functionalities used throughout the application:

- **guards/**: Guard class for handling API permissions.
- **interfaces/**: Interfaces and types used across the application.
- **database/**: Database services and setup files.
- **services/**: Winston logger service for logging, Postgres database connection service.
- **middleware/**: Authentication middleware, request body validator and error handler.

### `scripts/`

This folder contains scripts for database setup and seeding.

### `test/`

This folder contains jest testing setup.

### `utils/`

This folder contains utility classes and functions for date and amount conversion.

### Unit Testing

Jest is used for unit testing. Test files are organized into the `test/` folder and are executed using the `jest` command. Configuration for Jest can be found in the `jest.config.js` file.

### Project Architecture

The project follows clean architecture principles to ensure separation of concerns, maintainability, and scalability. Key aspects include:

- Modular Design: The project is divided into modules (e.g auth, serviceA), each responsible for a specific aspect of the application.
- Separation of Concerns: Different parts of the application (e.g., entities, controllers, services) are organized into separate modules.
- Dependency Injection: Using Inversify for DI ensures that components are loosely coupled and easier to test.

## Prerequisites

- Node.JS
- NPM (Node Package Manager)
- Docker (if you want to run the application with Docker)
- Postgres (if you want to run the application without Docker)

## Installation

To install App, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/rjsaran/node-starter-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd node-starter-app
   ```

3. Install dependencies using npm:

   ```bash
   npm install
   ```

4. Create a .env file, Refer [example](.env.example)
   - **POSTGRES_USER**="Postgres User Name"
     - Default: postgres
     - Mandatory: If running in docker
   - **POSTGRES_PASSWORD**="Postgres Password"
     - Default: No Password
     - Mandatory: If running in docker
   - **POSTGRES_HOST**="Postgres Host"
     - Default: 127.0.0.1
     - Set as `database` if running in docker
   - **POSTGRES_DB**="Postgres Database"
     - Default: node_starter

## Running the Server

### Non Docker Mode

To run the server in non-docker mode, Execute the following command:

1. Build typescript

   ```bash
    npm run build
   ```

2. Run server:
   ```bash
   npm start
   ```

This will start the server using TypeScript and automatically transpile the code into JavaScript. The server will then be accessible at `http://127.0.0.1:{PORT}`.

### Docker Mode

To run the server in docker, execute the following command:

- Run server
  ```bash
   npm run docker:run:build
  ```

This will start the server in docker. The server will then be accessible at `http://127.0.0.1:{PORT}`.

### Development Mode

To run the server in development mode, use the following command:

```bash
npm run start:dev
```

This will start the server using nodemon, which automatically restarts the server when changes are detected in the code.

### Test Mode

To test the code in test mode, use the following command:

```bash
npm run test
```

### Other Scripts

- `lint`: Runs ESLint to lint TypeScript files.
- `lintfix`: Runs ESLint with the `--fix` flag to automatically fix linting issues.

# Documentation

## Description

This document outlines the steps for the user and admin interactions with the APIS.

Make sure to replace `<token>` with the actual token received after logging in.
If using postman ENV variables, replace `ACCESS_TOKEN` variable with customer/admin token.

## Login Credentials

- A account with login credentials.

  **Email:** `account@nodestarterapp.com`

  **Password:** `account@123`

## API Endpoints

### User Endpoints

1. **Login**:

   - **Endpoint**: `POST /api/auth/login`
   - **Description**: Allows a customer to login with their credentials.
