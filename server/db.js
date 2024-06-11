const { Sequelize } = require('sequelize');

let dbName = process.env.DB_NAME || 'online_store';
let user = process.env.DB_USER || 'postgresuser';
let password = process.env.DB_PASSWORD || '130504A';
let host =
  process.env.DB_HOST ||
  'onlinestoredb.cnku26uqacuc.eu-north-1.rds.amazonaws.com';
let port = process.env.DB_PORT || 5432;
module.exports = new Sequelize(dbName, user, password, {
  dialect: 'postgres',
  host: host,
  port: port,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },
});
