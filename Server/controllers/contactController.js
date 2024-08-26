const db = require("../models");
const jwt = require("jsonwebtoken");
const ContactUsMessage = db.ContactUsMessage;

const saveContactMessage = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization token is missing or invalid." });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { national_id } = decodedToken;

    if (!national_id) {
      return res
        .status(401)
        .json({ error: "Token does not contain a valid national_id." });
    }

    const { message } = req.body;

    const newMessage = await ContactUsMessage.create({
      national_id,
      message,
    });

    res.status(201).json({
      message: "Contact message saved successfully.",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      error:
        error.message || "An error occurred while saving the contact message.",
    });
  }
};

module.exports = {
  saveContactMessage,
};
