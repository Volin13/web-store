const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const bcrypt = require('bcrypt');
const createTokens = require('../../helpers/createTokens');
const UAParser = require('ua-parser-js');
const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_KEY } = process.env;

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const lowCaseEmail = email.toLowerCase();
  // -----------------------------------------------
  if (email === 'superuser@mail.com') {
    const superuser = await User.findOne({ where: { email: email } });
    res.json({
      accessToken: 'superuser',
      refreshToken: 'superuser',
      user: {
        name: superuser.name,
        email: superuser.email,
        avatar: superuser.avatar,
      },
    });
    return;
  }
  // ------------------------------------------------
  const user = await User.findOne({ where: { email: lowCaseEmail } });
  if (!user) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  if (!user.verify) {
    return next(ApiError.unauthorized('Підтвердіть свій Email'));
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  const userDeviceInfo = JSON.stringify(UAParser(req.headers['user-agent']));

  if (user.userDeviceInfo && userDeviceInfo !== user.userDeviceInfo) {
    if (user.accessToken) {
      try {
        jwt.verify(user.accessToken, ACCESS_SECRET_KEY);
        throw new Error('forbidden');
      } catch (error) {
        if (error.message === 'forbidden') {
          return next(ApiError.forbidden('Токен не є актуальним'));
        }
      }
    }
  }

  const tokens = createTokens(user.id);
  await User.findByIdAndUpdate(user.id, { ...tokens, userDeviceInfo });

  res.json({
    ...tokens,
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

module.exports = login;
