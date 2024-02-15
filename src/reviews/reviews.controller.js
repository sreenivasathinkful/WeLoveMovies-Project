const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
    // TODO: Add your code here.
  const review = await service.list(request.params.reviewId);
  if (review) {
     response.locals.review = review
     next()
  } else {
    next({
      status: 404,
      message: `Review cannot be found ${request.params.reviewId}`
    })
  }
}

async function destroy(request, response) {
    // TODO: Add your code here.
  await service.destroy(request.params.reviewId)
  response.sendStatus(204)
}

async function list(request, response) {
    // TODO: Add your code here.
  response.status(200).json({ data: await service.list(request.params.reviewId) });
}

function hasMovieIdInPath(request, response, next) {
    // TODO: Add your code here.
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
    // TODO: Add your code here.
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const updatedReviewInDB = await service.update(updatedReview)
  response.status(200).json({ data: updatedReviewInDB })
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};