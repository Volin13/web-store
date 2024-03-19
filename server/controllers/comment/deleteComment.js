const { Comment, Reply } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const deleteComment = async (req, res, next) => {
  const { userId } = req.query;
  const { id } = req.params;
  const comment = await Comment.findOne({
    where: { id: id },
  });
  const replies = await Reply.findAll({
    where: { commentId: id },
  });
  if (!comment) {
    return next(ApiError.notFound('Коментар не знайдено'));
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
};
module.exports = deleteComment;
