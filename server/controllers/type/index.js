const create = require('./create');
const getAll = require('./getAll');

const { controllerWrapper } = require('../../helpers');

module.exports = {
  create: controllerWrapper(create),
  getAll: controllerWrapper(getAll),
};
