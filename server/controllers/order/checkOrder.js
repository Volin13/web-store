const { Order } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const checkOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findByPk(orderId);
  if (!order) {
    return next(ApiError.notFound('Замовлення з таким id не знайдено'));
  }
  await order.update({ checked: true });
  return res.json(order);
};
module.exports = checkOrder;
