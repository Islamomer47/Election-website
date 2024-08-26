const express = require("express");
const router = express.Router();
const {
  getLocalLists,
  increaseVoteCounter,
  createLocalList,
  getLocalListsNotApproved,
  localListApprove,
} = require("../controllers/localListController");

router.get("/get", getLocalLists);
router.post("/increase-vote/:name", increaseVoteCounter);
router.post("/create", createLocalList);
router.get("/get-not-approved", getLocalListsNotApproved);
router.put("/:id/approve", localListApprove);

module.exports = router;
