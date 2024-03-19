const { Reply } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const deleteReply = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.query;
  console.log(userId, typeof userId);
  const reply = await Reply.findByPk(id);
  if (!reply) {
    return next(ApiError.notFound('Відповідь не знайдено'));
  }

  // Перевірка, чи користувач власник відповіді
  if (reply.userId !== Number(userId)) {
    return next(ApiError.forbidden('Ви не можете видалити чужу відповідь'));
  }

  await reply.destroy();

  return res.json({ message: 'Відповідь успішно видалена' });
};
module.exports = deleteReply;
