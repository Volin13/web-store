const { Rating } = require('../../models/models');

const getAll = async (req, res) => {
  const ratings = await Rating.findAll();
  return res.json(ratings);
};
module.exports = getAll;
