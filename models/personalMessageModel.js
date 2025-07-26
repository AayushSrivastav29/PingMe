const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const PersonalMessages = sequelize.define("PersonalMessages", {
  text: DataTypes.TEXT,
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // References Users table
      key: "id",
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fileUrl: DataTypes.STRING,
  fileName: DataTypes.STRING,
  fileType: DataTypes.STRING,
});

module.exports = PersonalMessages;
