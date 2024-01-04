const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentContoller');

router.post('/', commentController.createComment);
router.delete('/:id', commentController.deleteComment);
router.patch('/:id', commentController.editComment);

module.exports = router;
