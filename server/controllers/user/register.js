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
  const client = await User.findOne({ where: { email: email } });

  if (!email || !password) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }
  if (client) {
    if (!client.byGoogle) {
      return next(ApiError.conflict('Користувач з таким email уже існує'));
    } else {
      client.password = hashPassword;
      client.verificationToken = verificationToken;
      await client.save();
    }
  } else {
    client = await User.create({
      login,
      role,
      email: lowCaseEmail,
      password: hashPassword,
      verificationToken,
    });

    const basket = await Basket.create({ userId: client.id });
    await basket.save();
  }
  const verificationEmail = {
    to: email,
    subject: 'Підтвердження пошти',
    html: emailConfirmation(verificationToken),
  };
  await sendEmail(verificationEmail);
  const token = generateJwt(client.id, client.email, client.role);
  res.json({ token });
};

module.exports = register;
