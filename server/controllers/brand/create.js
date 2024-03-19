const { Brand } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const create = async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    next(ApiError.badRequest(e.message));
  }
  const brand = await Brand.create({ name });
  return res.json(brand);
};
module.exports = create;
