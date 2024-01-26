const { User, Basket } = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const sequelize = require('../db');

let SECRET_KEY = process.env.SECRET_KEY || 'random_secret_key1234';

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role, login } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return next(ApiError.badRequest('Ваш email або пароль невірний'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Користувач з таким email уже існує'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    // Створення користувача і його кошика

    // Генерація аватара за замовчуванням з використанням gravatar
    const avatar = generateAvatar(email);
    // Функція для генерації аватара за допомогою gravatar
    function generateAvatar(email) {
      const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
        email,
      )}?d=identicon`;
      return gravatarUrl;
    }
    const user = await User.create({
      email,
      role,
      password: hashPassword,
      login,
      avatar,
    });
    const basket = await Basket.create({ userId: user.id });
    // Повертаю токен з айді і роллю для подальшої перевірки

    const token = generateJwt(user.id, user.email, user.role);
    res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Користувача з таким email не існує'));
    }
    if (user.password === undefined) {
      return next(ApiError.internal('Невірний email або пароль'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Ваш email або пароль невірний'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    // перевірка ролі при логінізації/оновленню токена

    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }

  async checkLogin(req, res, next) {
    try {
      // перевірка ролі при логінізації/оновленню токена
      const { login } = req.query;
      const createdLogin = await User.findOne({
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('login')),
          sequelize.fn('LOWER', login),
        ),
      });
      return res.json(createdLogin ? true : false);
    } catch (error) {
      return next(ApiError.internal('Невірний логін'));
    }
  }
}

module.exports = new UserController();
