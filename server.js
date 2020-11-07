const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");

// My custom middleware for loggin
// const logger = require('./middleware/logger');

// Load environment variables
dotenv.config({
  path: "./config/config.env",
});

// Connect Database
connectDB();
const app = express();

// Body Parser
app.use(express.json());

// Route Files
const bootcamps = require("./Routes/bootcamps.js");

// Using Logger Middleware
app.use(morgan('dev'));

// Mount Router
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `The server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`.yellow
      .bold
  );
});

// Process unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});