const {
  getPartyList,
  increaseVoteCounter,
  createPartyList,
  getPartyListNotApproved,
  partyListApprove,
} = require("../controllers/partyListController");
const express = require("express");
const partyListRouter = express.Router();
partyListRouter.get("/get", getPartyList);
partyListRouter.put("/increase/:name", increaseVoteCounter);
partyListRouter.post("/create", createPartyList);
partyListRouter.get("/get-not-approved", getPartyListNotApproved);
partyListRouter.put("/:id/approve", partyListApprove);

module.exports = partyListRouter;
