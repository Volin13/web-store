const { Order } = require('../../models/models');
const ApiError = require('../../error/ApiError');

const getOrdersHistory = async (req, res) => {
  // Знаходження всіх замовлень !checked
  const checkedOrders = await Order.findAll({
    where: {
      checked: true,
    },
  });

  if (checkedOrders) {
    return res.json(checkedOrders);
  } else {
    return next(ApiError.internal('Історія замовлень відсутня'));
  }
};
module.exports = getOrdersHistory;
