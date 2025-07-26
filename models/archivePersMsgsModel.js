const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const ArchivedPersonalChats = sequelize.define(
  "ArchivedPersonalChats",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fileUrl: DataTypes.STRING,
    fileName: DataTypes.STRING,
    fileType: DataTypes.STRING,
  },
  {
    timestamps: false, // Since we're manually handling createdAt
  }
);

module.exports = ArchivedPersonalChats;
