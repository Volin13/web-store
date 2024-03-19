const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const verifyUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    return next(ApiError.badRequest('Не було пройдено верифікацію'));
  }
  await User.findOneAndUpdate(user.id, {
    verify: true,
    verificationToken: null,
    onlyGoogle: false,
  });

  res.json({
    message: 'Верифікаця успішна',
  });
};

module.exports = verifyUser;
