const { Order } = require('../../models/models');

const getUserOrders = async (req, res) => {
  const userId = req.params.userId;
  const userOrders = await Order.findAll({ where: { userId } });

  return res.json(userOrders);
};
module.exports = getUserOrders;
