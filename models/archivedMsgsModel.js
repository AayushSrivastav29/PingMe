const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const ArchivedChats = sequelize.define('ArchivedChats', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Groups',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false, // Since we're manually handling createdAt
});

module.exports = ArchivedChats;