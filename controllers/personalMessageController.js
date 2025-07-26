const  PersonalMessages  = require("../models/personalMessageModel");
const ArchivedPersonalChats = require("../models/archivePersMsgsModel");
const  Users  = require("../models/userModel");

const { Op } = require("sequelize");
const { uploadFile } = require("../utils/s3Upload");

const sendPersMessage = async (req, res) => {
  try {
    const { text, receiverId } = req.body;
    const senderId = req.user.id;

    let fileData = null;
    if (req.file) {
      const result = await uploadFile(req.file);
      fileData = {
        fileUrl: result.Location,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
      };
    }

    const message = await PersonalMessages.create({
      text,
      senderId,
      receiverId,
      ...fileData,
    });

    // Emit real-time event with file data
    if (req.app.get("socketio")) {
      req.app.get("socketio").emit("new-pers-message", {
        text,
        sender: req.user.name,
        senderId: req.user.id,
        receiverId,
        ...fileData, // Include file data in socket event
      });
    }

    res.status(201).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

const getPersMessages = async (req, res) => {
  try {
    const {receiverId}= req.params;
    const senderId= req.user.id;

    const messages = await PersonalMessages.findAll({
        where:{
            [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
        },
      include: [
        {
          model: Users,
          attributes: ['id', 'name'] 
        },
      ],
      order: [["createdAt", "ASC"]], // Oldest first
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};

async function archiveOldPersMessages() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1);
    console.log(cutoffDate, "<<<<<<<<<<<<<<<<<<<<<<<");

    const oldMessages = await PersonalMessages.findAll({
      where: {
        createdAt: { [Op.lt]: cutoffDate },
      },
      raw: true, // Get plain objects instead of model instances
    });

    console.log(oldMessages.length, ">>>>>>>>>>>>>>>>>>>>>>>>>");

    if (oldMessages.length > 0) {
      await ArchivedPersonalChats.bulkCreate(oldMessages, {
        fields: ["text", "senderId", "receiverId", "createdAt",  "fileUrl", "fileName" , "fileType"],
        validate: true,
      });

      // Delete archived messages
      await PersonalMessages.destroy({
        where: {
          createdAt: { [Op.lt]: cutoffDate },
        },
      });

      console.log(`Archived ${oldMessages.length} messages`);
    }
  } catch (error) {
    console.error("Archive error:", error);
  }
}

module.exports = {
  sendPersMessage,
  getPersMessages,
  archiveOldPersMessages,
};
