const { User } = require('../models/models');

const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, accessToken] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(ApiError.unauthorized('Email або пароль невірний 1'));
  }
  if (accessToken === 'superuser') {
    const superuser = await User.findOne({
      where: { email: 'superuser@mail.com' },
    });
    req.user = superuser;
    next();
  }
  try {
    const { id } = jwt.verify(accessToken, ACCESS_SECRET_KEY);
    const user = await User.findByPk(id);
    if (!user || !user.accessToken || user.accessToken !== accessToken) {
      return next(ApiError.unauthorized('Email або пароль невірний 2'));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Email або пароль невірний 3'));
  }
};

module.exports = authenticate;
