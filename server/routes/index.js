const Router = require("express");
const router = new Router();
const deviceRouter = require("./deviceRouter.js");
const userRouter = require("./userRouter.js");
const typeRouter = require("./typeRoter");
const brandRouter = require("./brandRouter.js");
const ratingRouter = require("./ratingRouter.js");
const ordersRouter = require("./ordersRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/rating", ratingRouter);
router.use("/orders", ordersRouter);

module.exports = router;
