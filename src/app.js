if (process.env.USER) require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

/**
 * Configures CORS and JSON body parsing middleware.
 * Registers routes for movies, theaters, and reviews.
 */

app.use(cors());
app.use(express.json());
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);
/**
 * Returns a 404 status and error message with the requested URL.
 */

app.use((req, res, next) => {
  return next({ status: 404, message: `Not found: ${req.originalUrl}` });
});

/**
 * Error handling middleware.
 * Handles errors by setting the status and sending an error response JSON object.
 */
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).json({ error: message });
});

module.exports = app;
