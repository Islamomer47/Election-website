const {
  createPartyListCandidate,
} = require("../controllers/partyListCandidateController");

const express = require("express");
const partyListCandidateRouter = express.Router();
partyListCandidateRouter.post("/create", createPartyListCandidate);
module.exports = partyListCandidateRouter;
