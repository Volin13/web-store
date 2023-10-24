const { Rating } = require("../models/models");
const ApiError = require("../error/ApiError");

class RatingController {
  async create(req, res, next) {
    try {
      const { deviceId, userId, rate } = req.body;
      const voted = await Rating.findOne({ where: { userId } });
      const device = await Rating.findOne({ where: { deviceId } });
      if (voted && device) {
        return next(
          ApiError.internal("You have already voted for this device")
        );
      }
      const rating = await Rating.create({ rate, userId, deviceId });
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
      const ratings = await Rating.findAll({ where: { deviceId: id } });
      if (ratings.length === 0) {
        return res.json({ averageRating: 0 });
      }

      const totalRating = ratings.reduce((acc, rating) => acc + rating.rate, 0);
      const averageRating = totalRating / ratings.length;

      return res.json({ averageRating });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new RatingController();
