const { Device } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const getDeviceRating = async (req, res) => {
  const { id } = req.params;
  const device = await Device.findByPk(id);
  if (!device) {
    return next(ApiError.badRequest('Девайс не знайдено'));
  }
  const rating = device.rating;
  return res.json(rating);
};
module.exports = getDeviceRating;
