const { Order } = require("../models/models");
const { Op } = require("sequelize");

const deleteOldOrdersMiddleware = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const outdatedOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.lt]: sixMonthsAgo,
        },
      },
    });
    // Видаляємо замовлення, час створення яких більше шести місяців
    if (outdatedOrders.length > 0) {
      const deletedOrdersCount = await Order.destroy({
        where: {
          createdAt: {
            [Op.lt]: sixMonthsAgo,
          },
        },
      });
    }

    console.log(`Видалено ${deletedOrdersCount} замовлень.`);
    await next();
  } catch (error) {
    console.log("При видаленні замовлень сталась помилка");
    await next();
  }
};

module.exports = deleteOldOrdersMiddleware;
