const { ACCESS_SECRET_KEY } = process.env;
const ApiError = require('../error/ApiError');

const jwt = require('jsonwebtoken');

const googleAuthMiddlware = async (req, res, next) => {
  if (req.body?.email || req.body?.password) {
    return next(ApiError.badRequest());
  }
  try {
    const { googleAuthToken } = req.body;
    console.log(googleAuthToken);
    const { email, name, googlePassword } = jwt.verify(
      googleAuthToken,
      ACCESS_SECRET_KEY,
    );
    req.body.email = email;
    req.body.name = name;
    req.body.googlePassword = googlePassword;
    console.log(email, name, googlePassword);
  } catch (error) {
    console.log(error.message);
    return next(ApiError.badRequest());
  }
  next();
};
module.exports = googleAuthMiddlware;
