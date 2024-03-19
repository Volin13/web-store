const { Order } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const declineOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findByPk(orderId);
  if (!order) {
    return next(ApiError.notFound('Замовлення з таким id не знайдено'));
  }
  await order.update({ decline: !order.declined });
  return res.json(order);
};
module.exports = declineOrder;
