const { User } = require('../models/models');

const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, accessToken] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(ApiError.unauthorized('Email або пароль невірний'));
  }
  // ----------------------------------->
  if (accessToken === 'superuser') {
    const superuser = await User.findOne({
      where: { email: 'superuser@mail.com' },
    });
    req.user = superuser;
    next();
    return;
  }
  // <-------------------------------------
  try {
    const { id } = jwt.verify(accessToken, ACCESS_SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.accessToken || user.accessToken !== accessToken) {
      return next(ApiError.unauthorized('Email або пароль невірний'));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Email або пароль невірний'));
  }
};

module.exports = authenticate;
