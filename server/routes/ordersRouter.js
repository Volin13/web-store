const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const deleteOldOrdersMiddleware = require("../middleware/deleteOldOrdersMiddleware");

router.post("/", orderController.createOrder);
router.get("/new-orders", orderController.getNewOrders);
router.get(
  "/orders-history",
  deleteOldOrdersMiddleware,
  orderController.getOrdersHistory
);
router.get(
  "/user-orders/:userId",
  deleteOldOrdersMiddleware,
  orderController.getUserOrders
);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/update", orderController.updateOrder);

module.exports = router;
