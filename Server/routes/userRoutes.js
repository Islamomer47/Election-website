const express = require("express");
const router = express.Router();
const {
  getUser,
  getAllDistricts,
  getAllcandidateUsers,
  getCnadidateInfo,
  isVoteLocal,
  getUserIDByName,
  isVoteParty,
  getUserCount,
  getVotedLocalPercentage,
  getUserByToken,
  getAllUsersByDistrictId,
  changeFromVoterToCandidate,
  getAllVoteUsers,
  getAllWinnersForDistrict,
  getAllcandidateUsersFromAnyDistrict,
} = require("../controllers/userController");

router.get("/get/:id", getUser);
router.get("/get-by-token", getUserByToken);

router.get("/user/district-info", getUserDistrictInfo);
router.get("/election-info", getAllDistricts);
router.get("/candidate/:id", getAllcandidateUsers);
router.get("/candidate-info/:id", getCnadidateInfo);
router.post("/is-vote-local/:id", isVoteLocal);
router.get("/user-id/:name", getUserIDByName);
router.post("/is-vote-party/:id", isVoteParty);

router.get("/user/district-info", getUserDistrictInfo);
router.get("/election-info", getAllDistricts);
router.get("/user-count", getUserCount);
router.get("/voted-local-percentage", getVotedLocalPercentage);
router.get("/users-by-district/:id", getAllUsersByDistrictId);
router.put("/change-to-candidate/:id", changeFromVoterToCandidate);
router.get("/vote-users", getAllVoteUsers);
router.get("/candidates/details", getAllcandidateUsersFromAnyDistrict);

//result Page
router.get("/candidates/details/:district_id", getAllWinnersForDistrict);

module.exports = router;
