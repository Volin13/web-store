const { Type } = require('../../models/models');

const create = async (req, res) => {
  const { name } = req.body;
  const type = await Type.create({ name });
  return res.json(type);
};
module.exports = create;
