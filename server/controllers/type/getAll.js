const { Type } = require('../../models/models');

const getAll = async (req, res) => {
  const types = await Type.findAll();
  return res.json(types);
};
module.exports = getAll;
