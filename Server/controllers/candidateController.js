const { Candidate } = require("../models");

const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findOne({
      where: { national_id: req.params.id },
    });
    res.json({ candidates });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const increaseVote = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      where: { national_id: req.params.id },
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    console.log("candidate", candidate);
    candidate.votes += 1;
    await candidate.save();

    res.json({
      message: "votes increased",
      votes: candidate.votes,
    });
  } catch (error) {
    console.error("Error increasing votes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.json({ candidate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllCandidates, increaseVote, createCandidate };
