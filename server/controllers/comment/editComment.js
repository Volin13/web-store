const { Comment } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const editComment = async (req, res, next) => {
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
};
module.exports = editComment;
