const {
  getAllCandidates,
  increaseVote,
  createCandidate,
} = require("../controllers/candidateController");
const express = require("express");
const router = express.Router();

router.get("/candidate/:id", getAllCandidates);
router.post("/vote/:id", increaseVote);
router.post("/create", createCandidate);

module.exports = router;
