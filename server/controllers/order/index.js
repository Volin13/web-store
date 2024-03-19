const createOrder = require('./createOrder');
const getUserOrders = require('./getUserOrders');
const getOrderById = require('./getOrderById');
const getNewOrders = require('./getNewOrders');
const getOrdersHistory = require('./getOrdersHistory');
const checkOrder = require('./checkOrder');
const declineOrder = require('./declineOrder');

const { controllerWrapper } = require('../../helpers');

module.exports = {
  createOrder: controllerWrapper(createOrder),
  getUserOrders: controllerWrapper(getUserOrders),
  getOrderById: controllerWrapper(getOrderById),
  getNewOrders: controllerWrapper(getNewOrders),
  getOrdersHistory: controllerWrapper(getOrdersHistory),
  checkOrder: controllerWrapper(checkOrder),
  declineOrder: controllerWrapper(declineOrder),
};
