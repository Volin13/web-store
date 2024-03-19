const { Comment, Reply } = require('../../models/models');

const getDeviceComments = async (req, res, next) => {
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
};
module.exports = getDeviceComments;
