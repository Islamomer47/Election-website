// controllers/ChatController.js

const { ChatMessage } = require("../models");

class ChatController {
  static async getMessages(req, res) {
    try {
      const messages = await ChatMessage.findAll({
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).send("Server error");
    }
  }

  static async postMessage(req, res) {
    const { user_id, message, is_admin } = req.body;
    try {
      const newMessage = await ChatMessage.create({
        user_id,
        message,
        is_admin,
      });
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).send("Server error");
    }
  }
}

module.exports = ChatController;
