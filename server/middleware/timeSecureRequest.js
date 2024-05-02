const ApiError = require('../error/ApiError');

const timeSecureRequest = (delay = 1000) => {
  return async (req, res, next) => {
    const timeSinceLastDBSecureRequest =
      req.user?.timeSinceLastDBSecureRequest || Date.now() - 2000;

    if (Date.now() - timeSinceLastDBSecureRequest < delay) {
      return next(ApiError.forbidden('Занадто багато запитів'));
    }
    req.user.timeSinceLastDBSecureRequest = Date.now();

    try {
      await req.user.save();
    } catch (error) {
      console.log('Помилка при збереженні останніх змін:', error.message);
    }
    next();
  };
};

module.exports = timeSecureRequest;
