const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Messages = sequelize.define('Messages', {
  text: DataTypes.TEXT,
  
});

module.exports= Messages;