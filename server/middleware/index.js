const googleAuthMiddlware = require('./googleAuthMiddlware');
const upload = require('./uploadFile');
const authorization = require('./authorization');
const timeSecureRequest = require('./timeSecureRequest');

module.exports = {
  googleAuthMiddlware,
  authorization,
  upload,
  timeSecureRequest,
};
