const { Device, Comment, User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const { Op } = require('sequelize');

const createComment = async (req, res, next) => {
  const { deviceId, userId, text } = req.body.params;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const existingComment = await Comment.findOne({
    where: {
      userId: userId,
      deviceId: deviceId,
      createdAt: {
        [Op.between]: [todayStart, todayEnd],
      },
    },
  });

  if (existingComment) {
    // Якщо коментар вже існує для цього користувача, девайсу і в цей день, ви можете відредагувати його
    existingComment.text = `${existingComment.text} <br> ${text}`;
    await existingComment.save();

    return res.json(existingComment);
  }
  const device = await Device.findByPk(deviceId);
  if (!device) {
    return next(ApiError.notFound('Девайс не знайдено'));
  }
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return next(ApiError.notFound('Користувача не знайдено'));
  }
  // Якщо коментар не існує, створюємо новий
  const comment = await Comment.create({
    text: text,
    userId: userId,
    deviceId: deviceId,
    login: user.login,
    avatar: user.avatar,
  });

  return res.json(comment);
};
module.exports = createComment;
