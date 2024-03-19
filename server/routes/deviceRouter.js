const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/device/');

router.post('/', deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.patch('/:id', deviceController.edit);

module.exports = router;
