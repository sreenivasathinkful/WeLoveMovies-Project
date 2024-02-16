const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Lists all theaters.
 * @returns {Promise} A promise that resolves with an array of theaters.
 */
async function list(request, response) {
  const list = await service.list();
  response.status(200).json({ data: list });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
