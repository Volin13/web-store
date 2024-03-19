const Router = require('express');
const router = new Router();
const commentController = require('../controllers/comment/');

router.post('/', commentController.createReply);
router.delete('/:id', commentController.deleteReply);
router.patch('/:id', commentController.editReply);

module.exports = router;
