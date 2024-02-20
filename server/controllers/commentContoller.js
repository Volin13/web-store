const { Device, Comment, Reply, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class CommentController {
  async createComment(req, res, next) {
    try {
      const { deviceId, userId, text } = req.body.params;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const existingComment = await Comment.findOne({
        where: {
          userId: userId,
          deviceId: deviceId,
          createdAt: {
            [Op.between]: [todayStart, todayEnd],
          },
        },
      });

      if (existingComment) {
        // Якщо коментар вже існує для цього користувача, девайсу і в цей день, ви можете відредагувати його
        existingComment.text = `${existingComment.text} <br> ${text}`;
        await existingComment.save();

        return res.json(existingComment);
      }
      const device = await Device.findByPk(deviceId);
      if (!device) {
        return next(ApiError.badRequest('Девайс не знайдено'));
      }
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      // Якщо коментар не існує, створюємо новий
      const comment = await Comment.create({
        text: text,
        userId: userId,
        deviceId: deviceId,
        login: user.login,
        avatar: user.avatar,
      });

      return res.json(comment);
    } catch (error) {
      console.log(error);
      if (error.name === 'SequelizeValidationError') {
        // Обробка помилки валідації Sequelize
        return next(
          ApiError.badRequest(
            'Максимальна кількість знаків коментаря 255 символів',
          ),
        );
      }
      return next(
        ApiError.internal(
          error.message,
          'При створенні коментаря сталась помилка',
        ),
      );
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { userId } = req.query;
      const { id } = req.params;
      const comment = await Comment.findOne({
        where: { id: id },
      });
      const replies = await Reply.findAll({
        where: { commentId: id },
      });
      if (!comment) {
        return next(ApiError.badRequest('Коментар не знайдено'));
      }

      // Перевірка, чи користувач власник коментаря
      if (comment.userId !== Number(userId)) {
        return next(ApiError.forbidden('Ви не можете видалити чужий коментар'));
      }
      if (replies.length > 0) {
        replies.forEach(async reply => {
          await reply.destroy();
        });
      }
      await comment.destroy();

      return res.json({ message: 'Коментар успішно видалено' });
    } catch (e) {
      next(
        ApiError.internal(e.message, 'При видаленні коментаря сталась помилка'),
      );
    }
  }

  async editComment(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, text } = req.body.params;
      const comment = await Comment.findByPk(id);
      if (!comment) {
        return next(ApiError.badRequest('Коментар не знайдено'));
      }
      if (comment.userId !== Number(userId)) {
        return next(ApiError.forbidden('Ви не можете видалити чужий коментар'));
      }
      comment.text = text;
      await comment.save();

      return res.json(comment);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // Обробка помилки валідації Sequelize
        return next(
          ApiError.badRequest(
            'Максимальна кількість знаків коментаря 255 символів',
          ),
        );
      }
      return next(
        ApiError.internal(
          error.message,
          'При редагуванні коментаря сталась помилка',
        ),
      );
    }
  }

  async createReply(req, res, next) {
    try {
      const { commentId, userId, text } = req.body.params;
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      const comment = await Comment.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        return next(ApiError.badRequest('Коментар не знайдено'));
      }

      const reply = await Reply.create({
        text: text,
        userId: userId,
        commentId: commentId,
        login: user.login,
        avatar: user.avatar,
      });

      return res.json(reply);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // Обробка помилки валідації Sequelize
        return next(
          ApiError.badRequest(
            'Максимальна кількість знаків коментаря 255 символів',
          ),
        );
      }
      return next(
        ApiError.internal(
          error.message,
          'При створенні коментаря сталась помилка',
        ),
      );
    }
  }

  async deleteReply(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      console.log(userId, typeof userId);
      const reply = await Reply.findByPk(id);
      if (!reply) {
        return next(ApiError.badRequest('Відповідь не знайдено'));
      }

      // Перевірка, чи користувач власник відповіді
      if (reply.userId !== Number(userId)) {
        return next(ApiError.forbidden('Ви не можете видалити чужу відповідь'));
      }

      await reply.destroy();

      return res.json({ message: 'Відповідь успішно видалена' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async editReply(req, res, next) {
    try {
      const { id } = req.params;
      const { text, userId } = req.body.params;
      console.log(id, text, userId);
      const reply = await Reply.findByPk(id);
      if (!reply) {
        return next(ApiError.badRequest('Відповідь не знайдено'));
      }
      if (reply.userId !== Number(userId)) {
        return next(
          ApiError.forbidden('Ви не можете редагувати чужу відповідь'),
        );
      }
      reply.text = text;
      await reply.save();

      return res.json(reply);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // Обробка помилки валідації Sequelize
        return next(
          ApiError.badRequest(
            'Максимальна кількість знаків коментаря 255 символів',
          ),
        );
      }
      return next(
        ApiError.internal(
          error.message,
          'При редагуванні коментаря сталась помилка',
        ),
      );
    }
  }
  async getAllComments(req, res, next) {
    try {
      let { date, limit, page } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      let offset = page * limit - limit;

      const whereCondition = {};

      if (date !== undefined && date !== '') {
        whereCondition.updatedAt = date;
      }

      const comments = await Comment.findAndCountAll({
        where: whereCondition,
        order: [['createdAt', 'ASC']],
        include: [{ model: Reply, as: 'reply', order: [['createdAt', 'ASC']] }],
        limit,
        offset,
      });

      res.json(comments);
    } catch (error) {
      return next(
        ApiError.internal(
          error.message,
          'При завантажені коментарів сталась помилка',
        ),
      );
    }
  }

  async getDeviceComments(req, res, next) {
    try {
      let { limit, page } = req.query;
      const { id } = req.params;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;

      let offset = page * limit - limit;

      const comments = await Comment.findAndCountAll({
        where: { deviceId: id },
        order: [['createdAt', 'ASC']],
        include: [{ model: Reply, as: 'reply', order: [['createdAt', 'ASC']] }],
        limit,
        offset,
      });
      return res.json(comments);
    } catch (error) {
      return next(
        ApiError.internal(
          error.message,
          'При завантажені коментарів девайсу сталась помилка',
        ),
      );
    }
  }
}

module.exports = new CommentController();
