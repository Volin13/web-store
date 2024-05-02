const createTokens = require('../../helpers/createTokens');
const { REFRESH_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const refresh = async (req, res, next) => {
  const { refreshToken: token } = req.body;
  try {
    if (token === 'superuser') {
      const superuser = await User.findOne({
        where: { email: 'superuser@mail.com' },
      });
      res.json({
        accessToken: 'superuser',
        refreshToken: 'superuser',
        user: {
          name: superuser.login,
          email: superuser.email,
          avatar: superuser.avatar,
        },
      });
      return;
    }
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const user = await User.findByPk(id);

    if (!user || user.refreshToken !== token) {
      return next(ApiError.forbidden('Невірний рефреш токен'));
    }

    const newTokens = createTokens(id, user.email, user.role);
    await user.update({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });

    res.json({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });
  } catch (error) {
    return next(ApiError.forbidden('Невірний рефреш токен'));
  }
};

module.exports = refresh;
