const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require('./Middleware/error');
const connectDB = require("./config/db");
const fileUpload = require('express-fileupload');
const cors = require('cors');

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

// Handle Cors Error
app.use(cors());

// Route Files
const bootcamps = require('./routes/bootcamps.js');
const courses = require('./routes/courses.js');

// Using Logger Middleware
app.use(morgan('dev'));

// File Upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

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