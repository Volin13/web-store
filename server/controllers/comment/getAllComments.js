const { Comment, Reply } = require('../../models/models');
const { Op } = require('sequelize');

const getAllComments = async (req, res, next) => {
  let { date, limit, page } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 8;
  let offset = page * limit - limit;

  const whereCondition = {};

  if (date !== undefined && date !== '') {
    // Визначення діапазону дати для пошуку

    const startDate = new Date(date);
    const endDate = new Date(new Date(date).setDate(startDate.getDate() + 1)); // Додаємо один день до дати

    whereCondition.updatedAt = {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    };
  }

  const comments = await Comment.findAndCountAll({
    where: whereCondition,
    order: [['createdAt', 'ASC']],
    include: [{ model: Reply, as: 'reply', order: [['createdAt', 'ASC']] }],
    limit,
    offset,
  });

  res.json(comments);
};
module.exports = getAllComments;
