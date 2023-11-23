const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/new-orders", orderController.getNewOrders);
router.get("/orders-history", orderController.getCheckedOrders);
router.get("/user-orders", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/update", orderController.updateOrder);

module.exports = router;
