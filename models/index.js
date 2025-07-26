const ArchivedChats = require("./archivedMsgsModel");
const ArchivedPersonalChats = require("./archivePersMsgsModel");
const Group = require("./groupModel");
const Messages = require("./messageModel");
const PersonalMessages = require("./personalMessageModel");
const Users = require("./userModel");

//one to many
Users.hasMany(Messages, { foreignKey: 'senderId' });
Messages.belongsTo(Users, { foreignKey: 'senderId' });

//one to many
Group.hasMany(Messages,  { foreignKey: 'groupId' });
Messages.belongsTo(Group,  { foreignKey: 'groupId' });

ArchivedChats.belongsTo(Users, { foreignKey: 'senderId' });
ArchivedChats.belongsTo(Group, { foreignKey: 'groupId' });

Users.hasMany(ArchivedPersonalChats, { foreignKey: 'senderId' });
ArchivedPersonalChats.belongsTo(Users, { foreignKey: 'senderId' });

//one to many
Users.hasMany(PersonalMessages, { foreignKey: 'senderId' });
PersonalMessages.belongsTo(Users, { foreignKey: 'senderId' });

module.exports={
    Users,
    Messages,
    Group,
    ArchivedChats,
    PersonalMessages,
    ArchivedPersonalChats
}