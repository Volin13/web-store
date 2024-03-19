const googleAuthMiddlware = require('./googleAuthMiddlware');
const authMiddleware = require('./AuthMiddleware');
const upload = require('./uploadFile');
const authorization = require('./authorization');
const timeSecureRequest = require('./timeSecureRequest');

module.exports = {
  googleAuthMiddlware,
  authMiddleware,
  authorization,
  upload,
  timeSecureRequest,
};
