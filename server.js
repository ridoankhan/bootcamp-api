const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// Security pacakges
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// My custom middleware for loggin
// const logger = require('./middleware/logger');

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDB();

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());


// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Using Logger Middleware
app.use(morgan('dev'));

// Sanitize Data
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Preventing Cross-Site Scripting to happen
app.use(xss());

// Limit request rate
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

// Prevent http param polution
app.use(hpp());

// Handle Cors Error
app.use(cors());

// File Upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set swagger path
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

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
