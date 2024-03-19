const { User, Basket } = require('../../models/models');
const bcrypt = require('bcrypt');
const ApiError = require('../../error/ApiError');
const { sendEmail } = require('../../helpers');
const { v4: uuidv4 } = require('uuid');
const emailConfirmation = require('../../data/templates/emailConfirmation');

const register = async (req, res) => {
  const { email, password, role, login } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const lowCaseEmail = email.toLowerCase();
  console.log(User);
  const user = await User.findOne({ where: { email: email } });
  console.log(user);

  if (!email || !password) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  if (user) {
    if (!user.byGoogle) {
      return next(ApiError.conflict('Користувач з таким email уже існує'));
    } else {
      user.password = hashPassword;
      user.verificationToken = verificationToken;
      await user.save();
    }
  } else {
    console.log('1');
    user = await User.create({
      login,
      role,
      email: lowCaseEmail,
      password: hashPassword,
      verificationToken,
    });

    const basket = await Basket.create({ userId: user.id });
    await basket.save();
  }
  console.log('2');

  const verificationEmail = {
    to: email,
    subject: 'Підтвердження пошти',
    html: emailConfirmation(verificationToken),
  };
  await sendEmail(verificationEmail);
  const token = generateJwt(user.id, user.email, user.role);
  res.json({ token });
};

module.exports = register;
