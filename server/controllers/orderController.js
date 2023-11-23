const { Order } = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { userId, userData, userOrder } = req.body;

      const order = await Order.create({ userId, userData, userOrder });
      return res.json(order);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getUserOrders(req, res) {
    const { userId } = req.body;
    const userOrders = await Order.findAll({ where: { userId } });

    return res.json(userOrders);
  }

  async getOrderById(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    return res.json(order);
  }

  async getNewOrders(req, res, next) {
    try {
      // Знаходження всіх замовлень, де checked === true
      const newOrders = await Order.findAll({
        where: {
          checked: true,
        },
      });

      // Повернення результату
      return res.json(checkedOrders);
    } catch (error) {
      console.error("Помилка при отриманні замовлень:", error);
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }
  async getOrdersHistory(req, res, next) {
    try {
      // Знаходження всіх замовлень, де checked === true
      const checkedOrders = await Order.findAll({
        where: {
          checked: true,
        },
      });

      // Повернення результату
      return res.json(checkedOrders);
    } catch (error) {
      console.error("Помилка при отриманні замовлень:", error);
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }

  async updateOrder(req, res, next) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (!order) {
        return next(ApiError.notFound("Замовлення з таким id не знайдено"));
      }
      await order.update({ checked: true });
      return res.json(order);
    } catch (error) {
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }
}

module.exports = new OrderController();
