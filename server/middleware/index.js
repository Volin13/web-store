const googleAuthMiddlware = require('./googleAuthMiddlware');
const upload = require('./uploadFile');
const authorization = require('./authorization');
const timeSecureRequest = require('./timeSecureRequest');
const calculateAverageRating = require('./CalculateAverageRating');

module.exports = {
  googleAuthMiddlware,
  authorization,
  upload,
  calculateAverageRating,
  timeSecureRequest,
};
