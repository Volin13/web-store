const create = require('./create');
const getAll = require('./getAll');
const getDeviceRating = require('./getDeviceRating');

const { controllerWrapper } = require('../../helpers');

module.exports = {
  create: controllerWrapper(create),
  getAll: controllerWrapper(getAll),
  getDeviceRating: controllerWrapper(getDeviceRating),
};
