const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


/**
 * Checks if a movie exists with the given movieId.
 * If it exists, adds the movie data to response.locals.movie and calls next().
 * If not, calls next() with a 404 error.
 */
async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId)
  if (movie) {
    response.locals.movie = movie;
    next();
  } else {
    next({
      status: 404,
      message: `Movie not found ${movieId}`
    })    
  }
}


/**
 * Sends a 200 response with the movie data from response.locals.
 */
async function read(request, response) {
  response.status(200).json({ data: response.locals.movie });
}


/**
 * Gets the movie theater name for the movie with the given movieId.
 * Gets reviews for the movie with the given movieId.
 * Lists movies based on is_showing query parameter and then call service layer list method to get movies.
 */
async function getMovieTheaterName(request, response) {
  const { movieId } = request.params;
  const moviesWithTheaters = await service.getMoviesTheaters();
  response
    .status(200)
    .json({
      data: moviesWithTheaters.filter(
        ({ movie_id }) => movie_id === Number(movieId)
      ),
    });
}

/**
 * Gets the reviews for the movie with the given movieId.
 * Filters moviesReviews array to find reviews for movie with matching id.
 * And maps critic details onto each review.
 */
async function getMovieReview(request, response) {
  const { movieId } = request.params;
  const moviesReviews = await service.getMoviesReviews();
  const movieReview = moviesReviews
    .filter(({ movie_id }) => movie_id === Number(movieId))
    .map(({ movie_id, organization_name, preferred_name, surname }) => ({
      movie_id,
      critic: {
        organization_name,
        preferred_name,
        surname,
      },
    }));
  response.status(200).json({ data: movieReview });
}

/**
 * Lists movies based on is_showing query parameter by calling service layer 
 */
async function list(request, response) {
  const { is_showing } = request.query;
  const list = await service.list(is_showing);
  response.status(200).json({ data: list });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  getTheaterName: [asyncErrorBoundary(movieExists), getMovieTheaterName],
  getMovieReview: [asyncErrorBoundary(movieExists), getMovieReview]
};
