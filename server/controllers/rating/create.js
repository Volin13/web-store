const { Device, Rating } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const { calculateAverageRating } = require('../../middleware/');

const create = async (req, res, next) => {
  const { deviceId, userId, rate } = req.body;

  const device = await Device.findByPk(deviceId);
  if (!device) {
    return next(ApiError.notFound('Девайс не знайдено'));
  }
  // Перевірка чи користувач уже голосував саме за цей девайс
  const voted = await Rating.findOne({
    where: {
      userId: userId,
      deviceId: deviceId,
    },
  });

  if (voted) {
    return next(ApiError.forbidden('Ви уже оцінили цей девайс'));
  }
  // Створюю рейтинг який зазначив користувач
  const rating = await Rating.create({ rate, userId, deviceId });
  // Додаю цей рейтинг в девайс
  await device.addRating(rating);
  // обчислюю і встановлюю середній рейтинг девайсу
  device.rating = await calculateAverageRating(deviceId);

  await device.save();

  return res.json(rating);
};
module.exports = create;
