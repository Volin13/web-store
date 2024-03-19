const createTokens = require('../../helpers/createTokens');
const { REFRESH_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const ApiError = require('../../error/ApiError');
const { User } = require('../../models/models');

const refresh = async (req, res, next) => {
  const { refreshToken: token } = req.body;
  let tokens = {};
  let userId = '';
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const user = await User.findById(id);
    if (user.refreshToken !== token) {
      return next(ApiError.badRequest('Не вірний рефреш токен'));
    }
    userId = id;
    tokens = createTokens(id);
  } catch (error) {
    return next(ApiError.forbidden(error.message));
  }
  await User.findByIdAndUpdate(userId, { ...tokens });

  res.json({
    ...tokens,
  });
};

module.exports = refresh;
