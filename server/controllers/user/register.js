const { User, Basket } = require('../../models/models');
const bcrypt = require('bcrypt');
const ApiError = require('../../error/ApiError');
const { sendEmail, createTokens } = require('../../helpers');
const { v4: uuidv4 } = require('uuid');
const emailConfirmation = require('../../data/templates/emailConfirmation');

const register = async (req, res, next) => {
  const { email, password, login = 'USER' } = req.body;
  if (!email || !password) {
    return next(ApiError.forbidden('Ваш email або пароль невірний'));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();
  const lowCaseEmail = email.toLowerCase();

  let client = await User.findOne({ where: { email: email } });

  if (client) {
    if (!client.byGoogle) {
      return next(ApiError.conflict('Користувач з таким email уже існує'));
    } else {
      client.password = hashPassword;
      client.verificationToken = verificationToken;
      await client.save();
      const basket = await Basket.create({ userId: client.id });
      await basket.save();
    }
  } else {
    client = await User.create({
      email: lowCaseEmail,
      password: hashPassword,
      login,
      verify: true,
      verificationToken: verificationToken,
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

  const tokens = createTokens(client.id, client.email, client.role);

  res.json({ tokens });
};

module.exports = register;
