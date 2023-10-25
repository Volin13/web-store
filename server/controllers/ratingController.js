const { Device, Rating } = require("../models/models");
const ApiError = require("../error/ApiError");
const calculateAverageRating = require("../middleware/CalculateAverageRating");

class RatingController {
  async create(req, res, next) {
    try {
      const { deviceId, userId, rate } = req.body;
      const voted = await Rating.findOne({ where: { userId } });
      const deviceRating = await Rating.findOne({ where: { deviceId } });
      if (voted && deviceRating) {
        return next(ApiError.forbidden("Ви уже голосували за цей девайс"));
      }
      const rating = await Rating.create({ rate, userId, deviceId });
      const device = await Device.findByPk(deviceId);

      if (!device) {
        return next(ApiError.badRequest("Девайс не знайдено"));
      }
      await device.addRating(rating);
      device.rating = await calculateAverageRating(device);
      await device.save();

      return res.json(rating);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
  async getAll(req, res) {
    const ratings = await Rating.findAll();
    return res.json(ratings);
  }

  async getDeviceRating(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.findByPk(id);
      if (!device) {
        return next(ApiError.badRequest("Девайс не знайдено"));
      }
      const rating = await calculateAverageRating(device);
      return res.json({ rating });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new RatingController();
