const db = require("../db/connection");

/**
 * Lists movies based on whether they are currently showing.
 * Gets movies and related theaters data.
 * Gets movies review data.
 * Joins movies, reviews, and critics tables.
 * Gets a single movie by id.
 */
async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

/**
 * Joins movies, movies_theaters, and theaters tables to get movies and related theaters data.
 * Selects all columns from the joined tables.
 */
async function getMoviesTheaters() {
  return db("movies_theaters as mt")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*");
}

/**
 * Joins movies, reviews and critics tables to get movies reviews data.
 * Selects all columns from the joined tables.
 */
async function getMoviesReviews() {
  return db("reviews as r")
    .join("movies as m", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*");
}

/**
 * Gets a single movie by id.
 * @param {number} movie_id - The id of the movie to get.
 * @returns {Object} The movie data.
 */
async function read(movie_id) {
  return db("movies").select("*").where({ movie_id }).first();
}

module.exports = {
  list,
  read,
  getMoviesTheaters,
  getMoviesReviews
};
