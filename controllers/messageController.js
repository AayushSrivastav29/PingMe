const  Users  = require("../models/userModel");
const  Messages  = require("../models/messageModel");


const sendMessage = async (req, res) => {
  try {
    const { text, groupId } = req.body; 
    const senderId = req.user.id;
    const message = await Messages.create({ text, senderId, groupId }); 

    // Emit real-time event with groupId
    if (req.app.get('socketio')) {
      req.app.get('socketio').emit('new-message', {
        text,
        sender: req.user.name,
        groupId 
      });
    }

    res.status(201).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      include: [{ model: Users, attributes: ['name'] }], // Join with Users
      order: [['createdAt', 'ASC']], // Oldest first
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};


const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const messages = await Messages.findAll({
      where: { groupId },
      include: [{ model: Users, attributes: ['name'] }],
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch group messages" });
  }
};

module.exports={
    sendMessage,
    getMessages,
    getGroupMessages
}