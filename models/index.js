const Group = require("./groupModel");
const Messages = require("./messageModel");
const Users = require("./userModel");

//one to many
Users.hasMany(Messages, { foreignKey: 'senderId' });
Messages.belongsTo(Users, { foreignKey: 'senderId' });

//one to many
Group.hasMany(Messages);
Messages.belongsTo(Group);


module.exports={
    Users,
    Messages,
    Group
}