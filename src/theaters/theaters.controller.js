const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
  const list = await service.list();
  response.status(200).json({ data: list });
}

module.exports = {
  list: asyncErrorBoundary(list),
};