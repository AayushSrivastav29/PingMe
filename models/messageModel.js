const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Messages = sequelize.define('Messages', {
  text: DataTypes.TEXT,
  senderId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // References Users table
      key: 'id',
    },
  },
});

module.exports= Messages;