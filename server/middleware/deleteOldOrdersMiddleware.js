const { Op } = require("sequelize");
const moment = require("moment");
const ApiError = require("../error/ApiError");

const deleteOldOrdersMiddleware = async (req, res, next) => {
  try {
    const threeMonthsAgo = moment().subtract(3, "months").toDate();

    // Видаляємо замовлення, час створення яких більше трьох місяців
    const deletedOrdersCount = await Order.destroy({
      where: {
        createdAt: {
          [Op.lt]: threeMonthsAgo,
        },
      },
    });

    console.log(`Видалено ${deletedOrdersCount} замовлень.`);

    next();
  } catch (error) {
    next(ApiError.internal("При видаленні замовлень сталась помилка"));
  }
};

module.exports = deleteOldOrdersMiddleware;
