const { Device, Rating } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const calculateAverageRating = require('../../middleware/CalculateAverageRating');

class RatingController {
  async create(req, res, next) {
    try {
      const { deviceId, userId, rate } = req.body;
      // Перевірка чи користувач уже голосував саме за цей девайс

      const voted = await Rating.findOne({ where: { userId } });

      const deviceRating = await Rating.findOne({ where: { deviceId } });
      if (voted && deviceRating) {
        return next(ApiError.forbidden('Ви уже оцінили цей девайс'));
      }
      // Створюю рейтинг який зазначив користувач
      const rating = await Rating.create({ rate, userId, deviceId });
      const device = await Device.findByPk(deviceId);
      if (!device) {
        return next(ApiError.notFound('Девайс не знайдено'));
      }
      // Додаю цей рейтинг в девайс
      await device.addRating(rating);
      // обчислюю і встановлюю середній рейтинг девайсу
      device.rating = await calculateAverageRating(device);
      await device.save();

      return res.json(rating);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
  async getAll(req, res) {
    // Повертаю всі рейтинги всіх девайсів
    const ratings = await Rating.findAll();
    return res.json(ratings);
  }

  async getDeviceRating(req, res, next) {
    // Повертаю рейтинг девайсу за айді

    try {
      const { id } = req.params;
      const device = await Device.findByPk(id);
      if (!device) {
        return next(ApiError.badRequest('Девайс не знайдено'));
      }
      const rating = device.rating;
      return res.json(rating);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new RatingController();
