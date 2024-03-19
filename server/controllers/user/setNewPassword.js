const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_KEY } = process.env;

const setNewPassword = async (req, res) => {
  // Get request data
  const { email, resetPasswordToken, password } = req.body;
  const lowCaseEmail = email.toLowerCase();

  // User data validation
  const user = await User.findOne({ where: { email: lowCaseEmail } });
  if (!user) {
    return next(ApiError.forbidden('Ваш email невірний'));
  }
  if (!user.verify) {
    return next(ApiError.unauthorized('Ваш email не підтверджено'));
  }

  // Password change procedure
  const { savedEmail } = jwt.verify(resetPasswordToken, ACCESS_SECRET_KEY);
  if (
    savedEmail !== user.email ||
    savedEmail !== lowCaseEmail ||
    !user.verificationToken ||
    user.password !== resetPasswordToken ||
    user.passwordResetStage !== 'Пароль змінено'
  ) {
    throw HttpError(409);
  }
  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  user.verificationToken = null;
  user.passwordResetStage = '';
  await user.save();
  res.json({ message: 'Success' });
};

module.exports = setNewPassword;
