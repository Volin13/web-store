const { Order } = require('../../models/models');

const createOrder = async (req, res) => {
  const { userId, userData, orderList } = req.body;
  const order = await Order.create({ userId, userData, orderList });
  return res.json(order);
};
module.exports = createOrder;
