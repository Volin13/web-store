const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.create);
router.get("/", orderController.getAll);
router.get("/user-orders", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);

module.exports = router;
