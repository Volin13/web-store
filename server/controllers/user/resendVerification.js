const { User } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const { sendEmail } = require('../../helpers');
const bcrypt = require('bcrypt');
const emailConfirmTemplate = require('../../data/templates/emailConfirmation');

const resendVerification = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  if (!user.verificationToken) {
    return next(ApiError.badRequest('Ви уже верифікували email'));
  }

  const verificationEmail = {
    to: email,
    subject: 'Email verification',
    html: emailConfirmTemplate(user.verificationToken),
  };
  await sendEmail(verificationEmail);

  res.json({
    message: 'Лист підтвердження вислано',
  });
};

module.exports = resendVerification;
