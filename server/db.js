const { Sequelize } = require('sequelize');

let dbName = process.env.DB_NAME || 'webstoredb';
let user = process.env.DB_USER || 'webstoredb_owner';
let password = process.env.DB_PASSWORD || 'bdRO5uBHDxf2';
let host =
  process.env.DB_HOST || 'ep-white-hill-a250hj6m.eu-central-1.aws.neon.tech';
let port = process.env.DB_PORT || 5432;
module.exports = new Sequelize(dbName, user, password, {
  dialect: 'postgres',
  host: host,
  port: port,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
