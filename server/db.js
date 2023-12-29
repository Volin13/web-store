const { Sequelize } = require("sequelize");

let dbName = process.env.DB_NAME || "online_store";
let user = process.env.DB_USER || "postgres";
let password = process.env.DB_PASSWORD || "130504A";
let host = process.env.DB_HOST || "localhost";
let port = process.env.DB_PORT || 5000;

module.exports = new Sequelize(dbName, user, password, {
  dialect: "postgres",
  host: host,
  port: port,
});
