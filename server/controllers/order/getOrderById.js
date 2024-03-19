const { Order } = require('../../models/models');

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);
  return res.json(order);
};
module.exports = getOrderById;
