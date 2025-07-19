const ArchivedChats = require("./archivedMsgsModel");
const Group = require("./groupModel");
const Messages = require("./messageModel");
const Users = require("./userModel");

//one to many
Users.hasMany(Messages, { foreignKey: 'senderId' });
Messages.belongsTo(Users, { foreignKey: 'senderId' });

//one to many
Group.hasMany(Messages,  { foreignKey: 'groupId' });
Messages.belongsTo(Group,  { foreignKey: 'groupId' });

ArchivedChats.belongsTo(Users, { foreignKey: 'senderId' });
ArchivedChats.belongsTo(Group, { foreignKey: 'groupId' });

module.exports={
    Users,
    Messages,
    Group,
    ArchivedChats
}