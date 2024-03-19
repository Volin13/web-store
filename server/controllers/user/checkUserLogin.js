const { User } = require('../../models/models');
const sequelize = require('../../db');
const ApiError = require('../../error/ApiError');

const checkUserLogin = async (req, res, next) => {
  try {
    // перевірка ролі при логінізації/оновленню токена
    const { login } = req.query;
    const createdLogin = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('login')),
        sequelize.fn('LOWER', login),
      ),
    });
    return res.json(createdLogin ? true : false);
  } catch (error) {
    return next(ApiError.internal('Невірний логін'));
  }
};

module.exports = checkUserLogin;
