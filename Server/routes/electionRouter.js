// routes/electionRoutes.js

const express = require("express");
const router = express.Router();
const { getPartyListResults } = require("../controllers/electionController");

// Route to get party list results
router.get("/district/:districtId/results", getPartyListResults);

module.exports = router;
