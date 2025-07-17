const Messages = require("./messageModel");
const Users = require("./userModel");

//one to many
Users.hasMany(Messages, { foreignKey: 'senderId' });
Messages.belongsTo(Users, { foreignKey: 'senderId' });



module.exports={
    Users,
    Messages
}