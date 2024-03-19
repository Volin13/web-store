const { Device, Rating } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const calculateAverageRating = require('../../middleware/CalculateAverageRating');

const create = async (req, res) => {
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
  console.log(device.rating);
  await device.save();

  return res.json(rating);
};
module.exports = create;
