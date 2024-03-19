const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const { sendEmail } = require('../../helpers');
const jwt = require('jsonwebtoken');
const passwordResetTemplate = require('../../data/templates/passwordResetTemplate');
const { ACCESS_SECRET_KEY } = process.env;

const sendPasswordResetEmail = async (req, res) => {
  // Get request data
  const { email } = req.body;
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

  // Allowed time between passwords reset procedures is 60 second
  const diffTime = Date.now() - user.passwordResetTime;
  const timeLeft = Math.round((60000 - diffTime) / 1000);
  if (timeLeft > 0) {
    return next(ApiError.tooEarly(`${timeLeft}`));
  }

  // Reset time of the beginning of new password reset procedure
  user.passwordResetTime = Date.now();

  // Change procedure stage status
  user.passwordResetStage = 'email токен було вислано';

  // Save reset token
  user.verificationToken = resetToken;
  await user.save();

  // Send email
  const verificationEmail = {
    to: email,
    subject: 'Password reset',
    html: passwordResetTemplate(user.verificationToken),
  };
  await sendEmail(verificationEmail);

  res.json({ message: 'Email з посиланням для зміни паролю вислано' });
};

module.exports = sendPasswordResetEmail;
