const { Op } = require("sequelize");
const moment = require("moment");
const ApiError = require("../error/ApiError");

const deleteOldOrdersMiddleware = async (req, res, next) => {
  try {
    const sixMonthsAgo = moment().subtract(6, "months").toDate();

    const outdatedOrders = await Order.findAll({
      where: {
        createdAt: {
          [Op.lt]: sixMonthsAgo,
        },
      },
    });

    // Видаляємо замовлення, час створення яких більше шести місяців
    if (outdatedOrders) {
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
    next(ApiError.internal("При видаленні замовлень сталась помилка"));
  }
};

module.exports = deleteOldOrdersMiddleware;
