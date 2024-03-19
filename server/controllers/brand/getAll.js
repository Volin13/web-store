const { Brand } = require('../../models/models');

const getAll = async (req, res) => {
  const brands = await Brand.findAll();
  return res.json(brands);
};
module.exports = getAll;
