const { Reply } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const editReply = async (req, res, next) => {
  const { id } = req.params;
  const { text, userId } = req.body.params;
  console.log(id, text, userId);
  const reply = await Reply.findByPk(id);
  if (!reply) {
    return next(ApiError.badRequest('Відповідь не знайдено'));
  }
  if (reply.userId !== Number(userId)) {
    return next(ApiError.forbidden('Ви не можете редагувати чужу відповідь'));
  }
  reply.text = text;
  await reply.save();

  return res.json(reply);
};
module.exports = editReply;
