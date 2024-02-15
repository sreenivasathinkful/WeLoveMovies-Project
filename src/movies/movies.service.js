const db = require("../db/connection");

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

async function getMoviesTheaters() {
  return db("movies_theaters as mt")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
}

async function getMoviesReviews() {
  return db("reviews as r")
    .join("movies as m", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
}

async function read(movie_id) {
    return db("movies")
      .select("*")
      .where({movie_id})
      .first()
}

module.exports = {
  list,
  read,
  getMoviesTheaters,
  getMoviesReviews
};