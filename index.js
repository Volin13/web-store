require('dotenv').config();
const express = require('express');
const sequelize = require('./server/db');
const models = require('./server/models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./server/routes/index');
const errorHandler = require('./server/middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// error processing allways ending middleware
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
