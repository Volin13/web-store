const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const jwt = require('jsonwebtoken');
const { ACCESS_SECRET_KEY } = process.env;

const resetPassword = async (req, res) => {
  // Get request data
  const { email, resetEmailToken } = req.body;
  const lowCaseEmail = email.toLowerCase();

  // User data validation
  const user = await User.findOne({ where: { email: lowCaseEmail } });
  if (!user) {
    return next(ApiError.forbidden('Ваш email невірний'));
  }
  if (!user.verify) {
    return next(ApiError.unauthorized('Ваш email не підтверджено'));
  }

  // Generate encrypted email reset token
  const payload = {
    savedEmail: lowCaseEmail,
  };
  const resetToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '5m' });

  // Password reset and change on token with encrypted email
  const { savedEmail } = jwt.verify(resetEmailToken, ACCESS_SECRET_KEY);
  if (
    savedEmail !== lowCaseEmail ||
    resetEmailToken !== user.verificationToken ||
    user.passwordResetStage !== 'email токен було вислано'
  ) {
    throw HttpError(409);
  }

  user.password = resetToken;
  user.passwordResetStage = 'Пароль змінено';
  await user.save();
  res.json({ resetPasswordToken: resetToken });
};

module.exports = resetPassword;
