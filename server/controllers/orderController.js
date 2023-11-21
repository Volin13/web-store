class OrderController {
  async create(req, res, next) {
    try {
      const { userId, userData, userOrder } = req.body;

      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return next(ApiError.notFound("User not found"));
      }

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

  async getAll(req, res) {
    const orders = await Order.findAll();
    return res.json(orders);
  }
}

module.exports = new OrderController();
