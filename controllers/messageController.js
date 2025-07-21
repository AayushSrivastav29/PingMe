const Users = require("../models/userModel");
const Messages = require("../models/messageModel");
const { Op } = require("sequelize");
const ArchivedChats = require("../models/archivedMsgsModel");
const { uploadFile } = require("../utils/s3Upload");

const sendMessage = async (req, res) => {
  try {
    const { text, groupId } = req.body;
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

    const message = await Messages.create({
      text,
      senderId,
      groupId,
      ...fileData,
    });

    // Emit real-time event with file data
    if (req.app.get("socketio")) {
      req.app.get("socketio").emit("new-message", {
        text,
        sender: req.user.name,
        groupId,
        ...fileData, // Include file data in socket event
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
      include: [{ model: Users, attributes: ["name"] }], // Join with Users
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

const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Get recent messages (from the last 24 hours)
    const recentMessages = await Messages.findAll({
      where: { groupId },
      include: [{ model: Users, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
    });

    // Get archived messages (older than 24 hours)
    const archivedMessages = await ArchivedChats.findAll({
      where: {
        groupId,
        createdAt: { [Op.lt]: oneDayAgo },
      },
      include: [{ model: Users, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
    });

    // Combine and sort all messages
    const allMessages = [...recentMessages, ...archivedMessages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch group messages" });
  }
};

async function archiveOldMessages() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1);
    console.log(cutoffDate, "<<<<<<<<<<<<<<<<<<<<<<<");

    const oldMessages = await Messages.findAll({
      where: {
        createdAt: { [Op.lt]: cutoffDate },
      },
      raw: true, // Get plain objects instead of model instances
    });

    console.log(oldMessages.length, ">>>>>>>>>>>>>>>>>>>>>>>>>");

    if (oldMessages.length > 0) {
      await ArchivedChats.bulkCreate(oldMessages, {
        fields: ["text", "senderId", "groupId", "createdAt"],
        validate: true,
      });

      // Delete archived messages
      await Messages.destroy({
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
  sendMessage,
  getMessages,
  getGroupMessages,
  archiveOldMessages,
};
