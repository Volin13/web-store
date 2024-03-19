const { Order } = require('../../models/models');
const ApiError = require('../../error/ApiError');
const getNewOrders = async (req, res) => {
  // Знаходження всіх замовлень, checked
  const newOrders = await Order.findAll({
    where: {
      checked: false,
    },
  });
  if (newOrders.length === 0) {
    return ApiError.internal('Нових замовлень немає');
  }
  return res.json(newOrders);
};
module.exports = getNewOrders;
