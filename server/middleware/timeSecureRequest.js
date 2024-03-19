const ApiError = require('../error/ApiError');

const timeSecureRequest = (delay = 1000) => {
  return async (req, res, next) => {
    const timeSinceLastDBSecureRequest =
      req.user?.timeSinceLastDBSecureRequest || Date.now() - 2000;
    if (Date.now() - timeSinceLastDBSecureRequest < delay) {
      ApiError.forbidden('Занадто багато запитів');
    } else {
      req.user.timeSinceLastDBSecureRequest = Date.now();
      try {
        await req.user.save();
      } catch (error) {
        console.log(error.message);
      }
    }
    next();
  };
};

module.exports = timeSecureRequest;
