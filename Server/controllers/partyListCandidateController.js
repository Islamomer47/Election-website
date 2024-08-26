const { PartyListCandidate } = require("../models");

const createPartyListCandidate = async (req, res) => {
  try {
    const newPartyListCandidate = await PartyListCandidate.create(req.body);
    res.json(newPartyListCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPartyListCandidate };
