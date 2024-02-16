const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentContoller');

router.post('/', commentController.createComment);
router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getDeviceComments);
router.delete('/:id', commentController.deleteComment);
router.patch('/:id', commentController.editComment);

module.exports = router;
