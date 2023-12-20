const { Order } = require("../models/models");
const ApiError = require("../error/ApiError");
class OrderController {
  async createOrder(req, res, next) {
    // Створюєм замовлення з id userId даними користувача та самим вмістом замовлення
    try {
      const { userId, userData, orderList } = req.body;
      const order = await Order.create({ userId, userData, orderList });
      return res.json(order);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getUserOrders(req, res, next) {
    // Знаходимо всі замовлення конкретного юзера
    try {
      const userId = req.params.userId;
      const userOrders = await Order.findAll({ where: { userId } });

      return res.json(userOrders);
    } catch (error) {
      console.log(error);
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      return res.json(order);
    } catch (error) {
      console.log(error);
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }

  async getNewOrders(req, res, next) {
    try {
      // Знаходження всіх замовлень, checked
      const newOrders = await Order.findAll({
        where: {
          checked: false,
        },
      });
      if (newOrders.length === 0) {
        return ApiError.internal("Нових замовлень немає");
      }
      return res.json(newOrders);
    } catch (error) {
      console.error("Помилка при отриманні замовлень:", error);
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }
  async getOrdersHistory(req, res, next) {
    try {
      // Знаходження всіх замовлень !checked
      const checkedOrders = await Order.findAll({
        where: {
          checked: true,
        },
      });

      console.log("poof", checkedOrders);
      if (checkedOrders) {
        return res.json(checkedOrders);
      } else {
        return next(ApiError.internal("Історія замовлень відсутня"));
      }
    } catch (error) {
      console.error("Помилка при отриманні історії замовлень:", error);
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }

  async checkOrder(req, res, next) {
    // Змінюємо  checked на true

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
  async declineOrder(req, res, next) {
    // Змінюємо  decline на true

    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (!order) {
        return next(ApiError.notFound("Замовлення з таким id не знайдено"));
      }
      await order.update({ decline: !order.declined });
      return res.json(order);
    } catch (error) {
      return next(
        ApiError.internal("Виникла помилка, повторіть спробу пізніше")
      );
    }
  }
}

module.exports = new OrderController();
