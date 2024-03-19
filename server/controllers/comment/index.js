const createComment = require('./createComment');
const deleteComment = require('./deleteComment');
const editComment = require('./editComment');
const createReply = require('./createReply');
const deleteReply = require('./deleteReply');
const editReply = require('./editReply');
const getAllComments = require('./getAllComments');
const getDeviceComments = require('./getDeviceComments');

const { controllerWrapper } = require('../../helpers');

module.exports = {
  createComment: controllerWrapper(createComment),
  deleteComment: controllerWrapper(deleteComment),
  editComment: controllerWrapper(editComment),
  createReply: controllerWrapper(createReply),
  deleteReply: controllerWrapper(deleteReply),
  editReply: controllerWrapper(editReply),
  getAllComments: controllerWrapper(getAllComments),
  getDeviceComments: controllerWrapper(getDeviceComments),
};
