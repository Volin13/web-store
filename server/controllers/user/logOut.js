const { User } = require('../../models/models');

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    accessToken: null,
    refreshToken: null,
  });
  res.status(204).json({});
};

module.exports = logout;
