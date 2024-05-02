const jwt = require('jsonwebtoken');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const createTokens = (id, email, role) => {
  const payload = {
    id,
    email,
    role,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: '1d',
  });
  return { accessToken, refreshToken };
};

module.exports = createTokens;
