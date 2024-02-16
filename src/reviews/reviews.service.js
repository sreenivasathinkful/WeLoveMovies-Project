const db = require("../db/connection");

const tableName = "reviews";

/**
 * Deletes a review by ID from the reviews table.
 * @param {number} reviewId - The ID of the review to delete.
 * @returns {Promise} A promise that resolves when the record is deleted.
 */
async function destroy(reviewId) {
  return db(tableName).select("*").where({ review_id: reviewId }).del();
}

/**
 * Retrieves a review by ID from the reviews table.
 * @param {number} review_id - The ID of the review to retrieve.
 * @returns {Promise} A promise that resolves with the matching review object.
 */
async function list(review_id) {
  return db(tableName).select("*").where({ review_id }).first();
}

/**
 * Retrieves a review by ID from the reviews table.
 * @param {number} reviewId - The ID of the review to retrieve.
 * @returns {Promise} A promise that resolves with the matching review object.
 */
async function read(reviewId) {
  return db(tableName).select("*").where({ review_id: reviewId }).first();
}

/**
 * Retrieves a critic by ID from the critics table.
 * @param {number} critic_id - The ID of the critic to retrieve.
 * @returns {Promise} A promise that resolves with the matching critic object.
 */
async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

/**
 * Sets the critic on the given review by looking up the critic data from
 * the critics table using the review's critic_id.
 * @param {Object} review - The review object to set the critic on.
 * @returns {Promise} A promise that resolves to the updated review object.
 */
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

/**
 * Updates a review in the reviews table. Finds the existing review by ID,
 * @param {Object} review - The review object with updated values.
 * @returns {Promise} A promise that resolves to the updated review with critic data.
 */
async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
