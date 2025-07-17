const Messages = require("./messageModel");
const Users = require("./userModel");

//one to many
Users.hasMany(Messages);
Messages.belongsTo(Users);

module.exports={
    Users,
    Messages
}