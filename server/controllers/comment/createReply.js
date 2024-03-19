const { Comment, Reply, User } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const createReply = async (req, res, next) => {
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
    return next(ApiError.notFound('Коментар не знайдено'));
  }

  const reply = await Reply.create({
    text: text,
    userId: userId,
    commentId: commentId,
    login: user.login,
    avatar: user.avatar,
  });

  return res.json(reply);
};
module.exports = createReply;
