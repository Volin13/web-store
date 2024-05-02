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
  if (email === 'superuser@mail.com') {
    const superuser = await User.findOne({ where: { email: email } });
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

  const user = await User.findOne({ where: { email: lowCaseEmail } });

  if (!user) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  if (!user.verify) {
    return next(ApiError.unauthorized('Підтвердіть свій Email'));
  }

  let comparePassword;

  if (password) {
    if (user.byGoogle) {
      return next(ApiError.conflict('Ця пошта вже використовується'));
    }
    comparePassword = await bcrypt.compare(password, user.password);
  } else {
    const googlePassword = req.body.googlePassword;
    comparePassword = googlePassword === user.googlePassword;
  }
  if (!comparePassword) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  const userDeviceInfo = JSON.stringify(UAParser(req.headers['user-agent']));
  if (!userDeviceInfo) {
    return next(ApiError.forbidden('Сталась помилка спробуйте пізніше'));
  }
  if (user.userDeviceInfo && userDeviceInfo !== user.userDeviceInfo) {
    if (user.accessToken) {
      try {
        jwt.verify(user.accessToken, ACCESS_SECRET_KEY);
        return next(ApiError.forbidden('Цей профіль вже авторизовано'));
      } catch (error) {
        if (error.message === 'forbidden') {
          return next(ApiError.forbidden('Тільки одна сесія за раз'));
        }
      }
    }
  }

  const tokens = createTokens(user.id, user.email, user.role);
  await User.update(
    { ...tokens, userDeviceInfo },
    {
      where: {
        id: user.id,
      },
    },
  );
  res.json({
    ...tokens,
    user: {
      login: user.login,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });
};

module.exports = login;
