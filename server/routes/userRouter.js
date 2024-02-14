const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/AuthMiddleware');
router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.get('/auth', authMiddleware, UserController.check);
router.get('/auth/loginCheck', UserController.checkLogin);
router.get('/auth/data/:userId', UserController.getUserData);
router.patch('/auth/data/:userId', UserController.changeUserData);

module.exports = router;
