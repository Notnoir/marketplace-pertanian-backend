const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("marketplace-pertanian", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
