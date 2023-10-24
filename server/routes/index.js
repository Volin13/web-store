const Router = require('express');
const router = new Router();
const deviceRouter = require('./deviceRouter.js');
const userRouter = require('./userRouter.js');
const typeRouter = require('./typeRoter.js');
const brandRouter = require('./brandRouter.js');
const ratingRouter = require('./ratingRouter.js');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/rating', ratingRouter);

module.exports = router;
