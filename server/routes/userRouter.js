const Router = require('express');
const router = new Router();

const UserController = require('../controllers/user/');

const {
  googleAuthMiddlware,
  authorization,
  upload,
  timeSecureRequest,
} = require('../middleware/');
router.post('/registration', UserController.register);
router.post('/login', UserController.login);

router.get('/verify/:verificationToken', UserController.verifyUser);
router.post('/verify/resend-email', UserController.resendVerification);
router.post('/login-google', googleAuthMiddlware, UserController.login);
router.get('/redirect-google-login', UserController.redirectGoogleLogin);
router.get('/google-callback', UserController.googleCallback);
router.get('/auth/loginCheck', UserController.checkUserLogin);
router.get('/auth/data/:userId', UserController.getUserData);
router.post('/logout', UserController.logOut);
router.post('/refresh', UserController.refresh);
router.post('/reset/send-reset-link', UserController.sendPasswordResetEmail);
router.post('/reset/reset-password', UserController.resetPassword);
router.post('/reset/set-new-password', UserController.setNewPassword);
router.patch(
  '/auth/set-user-info/:userId',
  authorization,
  timeSecureRequest(),
  UserController.changeUserData,
);
module.exports = router;
