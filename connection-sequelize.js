const Sequelize = require("sequelize");

const connection = new Sequelize(
  process.env.NAME_DB,
  process.env.USER_DB,
  process.env.PASS_DB,
  {
    dialect: "mysql",
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+04:30",
  }
);

connection
  .authenticate()

module.exports = connection;
