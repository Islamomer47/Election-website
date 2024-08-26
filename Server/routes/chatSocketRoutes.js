const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatSocketController");

router.post("/messages", chatController.postMessage);
router.get("/messages", chatController.getMessages);

module.exports = router;
