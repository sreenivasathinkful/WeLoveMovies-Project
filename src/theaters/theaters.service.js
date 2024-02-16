const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

/**
 * Reduces movies data to only the properties needed for the theaters view.
 * Joins the movies data with the theater data on theater_id.
 */
const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

/**
 * Retrieves all theaters with their associated movies, joining the movies, movies_theaters, and theaters tables.
 * Reduces the joined data to contain only needed movie properties.
 * @returns {Promise} A promise that resolves to the reduced theater and movie data.
 */
async function list() {
  return db("theaters")
    .join(
      "movies_theaters",
      "movies_theaters.theater_id",
      "theaters.theater_id"
    )
    .join("movies", "movies.movie_id", "movies_theaters.movie_id")
    .then(reduceMovies);
}

module.exports = {
  list,
};
