const register = require('./register');
const login = require('./login');
const resendVerification = require('./resendVerification');
const verifyUser = require('./verifyUser');
const checkAuth = require('./checkAuth');
const checkUserLogin = require('./checkUserLogin');
const getUserData = require('./getUserData');
const changeUserData = require('./changeUserData');
const redirectGoogleLogin = require('./redirectGoogleLogin');
const googleCallback = require('./googleCallback');
const logOut = require('./logOut');
const refresh = require('./refresh');
const getCurrent = require('./getCurrent');
const sendPasswordResetEmail = require('./sendPasswordResetEmail');
const resetPassword = require('./resetPassword');
const setNewPassword = require('./setNewPassword');
const { controllerWrapper } = require('../../helpers');

module.exports = {
  register: controllerWrapper(register),
  verifyUser: controllerWrapper(verifyUser),
  login: controllerWrapper(login),
  logOut: controllerWrapper(logOut),
  resendVerification: controllerWrapper(resendVerification),
  checkAuth: controllerWrapper(checkAuth),
  checkUserLogin: controllerWrapper(checkUserLogin),
  getUserData: controllerWrapper(getUserData),
  changeUserData: controllerWrapper(changeUserData),
  redirectGoogleLogin: controllerWrapper(redirectGoogleLogin),
  googleCallback: controllerWrapper(googleCallback),
  refresh: controllerWrapper(refresh),
  getCurrent: controllerWrapper(getCurrent),
  sendPasswordResetEmail: controllerWrapper(sendPasswordResetEmail),
  resetPassword: controllerWrapper(resetPassword),
  setNewPassword: controllerWrapper(setNewPassword),
};
