const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Group = sequelize.define('Group', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    allowNull: false,
    autoIncrement:true
  },
    groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  members: {
  type: DataTypes.TEXT,
  allowNull: true,
  get() {
    const rawValue = this.getDataValue('members');
    return rawValue ? JSON.parse(rawValue) : [];
  },
  set(val) {
    this.setDataValue('members', JSON.stringify(val));
  }
}
});

module.exports= Group; 