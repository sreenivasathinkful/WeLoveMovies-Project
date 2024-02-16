const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 * Checks if a review with the given ID exists.
 * @param {Object} request - The request object
 * @param {Object} response - The response object
 * @param {Function} next - The next middleware function
 */
async function reviewExists(request, response, next) {
  const review = await service.list(request.params.reviewId);
  if (review) {
    response.locals.review = review;
    next();
  } else {
    next({
      status: 404,
      message: `Review cannot be found ${request.params.reviewId}`,
    });
  }
}

/**
 * Destroys the review with the given ID.
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 */
async function destroy(request, response) {
  await service.destroy(request.params.reviewId);
  response.sendStatus(204);
}

/**
 * Lists the review data for the review ID specified in the request parameters.
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 */
async function list(request, response) {
  response
    .status(200)
    .json({ data: await service.list(request.params.reviewId) });
}

/**
 * Checks if the request path contains the movieId parameter.
 * If found, calls next(). Otherwise calls methodNotAllowed.
 * @param {Object} request - The request object
 * @param {Object} response - The response object
 * @param {Function} next - The next middleware function
 */
function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

/**
 * Checks if the request path does not contain the movieId parameter.
 * If not found, calls next(). Otherwise calls methodNotAllowed.
 * @param {Object} request - The request object
 * @param {Object} response - The response object
 * @param {Function} next - The next middleware function
 */
function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

/**
 * Updates a review with the provided updated review data in the request body.
 * Merges the existing review data with the updated data.
 * Saves the updated review to the database and returns the updated review.
 */
async function update(request, response) {
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const updatedReviewInDB = await service.update(updatedReview);
  response.status(200).json({ data: updatedReviewInDB });
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
