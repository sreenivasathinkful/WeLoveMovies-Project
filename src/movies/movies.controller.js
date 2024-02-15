const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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

async function read(request, response) {
  response.status(200).json({ data: response.locals.movie });
}

async function getMovieTheaterName(request, response) {
  const { movieId } = request.params;
  const moviesWithTheaters = await service.getMoviesTheaters();
  response.status(200).json({ data: moviesWithTheaters.filter(({movie_id}) => movie_id === Number(movieId)) });
}

async function getMovieReview(request, response) {
  const { movieId } = request.params;
  const moviesReviews = await service.getMoviesReviews();
  const movieReview = moviesReviews.filter(({movie_id}) => movie_id === Number(movieId)).map(({movie_id, organization_name, preferred_name, surname}) => ({
    movie_id,
    critic: {
         organization_name, preferred_name, surname 
    }
  }))
  response.status(200).json({ data: movieReview });
}

async function list(request, response) {
  const { is_showing } = request.query;
  const list = await service.list(is_showing)
  response.status(200).json({ data: list });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  getTheaterName: [asyncErrorBoundary(movieExists), getMovieTheaterName],
  getMovieReview: [asyncErrorBoundary(movieExists), getMovieReview]
};