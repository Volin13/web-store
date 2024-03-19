const multer = require('multer');
const path = require('path');

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'), false);
    }
  },
});

module.exports = upload;
