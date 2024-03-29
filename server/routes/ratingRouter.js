const Router = require('express');
const router = new Router();
const ratingController = require('../controllers/rating/');

router.post('/', ratingController.create);
router.get('/', ratingController.getAll);
router.get('/:id', ratingController.getDeviceRating);

module.exports = router;
