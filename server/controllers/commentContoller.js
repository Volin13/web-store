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
          userId,
          deviceId,
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
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      // Якщо коментар не існує, створюємо новий
      const comment = await Comment.create({
        text,
        userId,
        deviceId,
        login: user.login,
        avatar: user.avatar,
      });

      // Додаємо коментар до девайсу
      const device = await Device.findByPk(deviceId);
      if (!device) {
        return next(ApiError.badRequest('Девайс не знайдено'));
      }

      await device.setComments([...(device.comments || []), comment]);

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
          'При створенні коментаря сталась помилка',
        ),
      );
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { userId } = req.body; // Додайте це поле в ваш запит

      const comment = await Comment.findOne({
        where: { id: commentId },
      });
      if (!comment) {
        return next(ApiError.badRequest('Коментар не знайдено'));
      }

      // Перевірка, чи користувач власник коментаря
      if (comment.userId !== userId) {
        return next(ApiError.forbidden('Ви не можете видалити чужий коментар'));
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
      const { commentId } = req.params;
      const { text } = req.body;

      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return next(ApiError.badRequest('Коментар не знайдено'));
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
        text,
        userId,
        commentId,
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
      const { replyId } = req.params;
      const { userId } = req.body; // Додайте це поле в ваш запит

      const reply = await Reply.findByPk(replyId);
      if (!reply) {
        return next(ApiError.badRequest('Відповідь не знайдено'));
      }

      // Перевірка, чи користувач власник відповіді
      if (reply.userId !== userId) {
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
      const { replyId } = req.params;
      const { text } = req.body;

      const reply = await Reply.findByPk(replyId);
      if (!reply) {
        return next(ApiError.badRequest('Відповідь не знайдено'));
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
  async getDeviceComments(req, res, next) {
    try {
      let { limit, page } = req.query;
      const { id } = req.params;
      page = page || 1;
      limit = limit || 5;

      let offset = page * limit - limit;

      const comments = await Comment.findAndCountAll({
        where: { deviceId: id },
        include: [{ model: Reply, as: 'reply' }],
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
