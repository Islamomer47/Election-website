const express = require("express");
const router = express.Router();
const {
  getDistrictByName,
  allDistricts,
} = require("../controllers/districtController");

// Route to get districts, optionally filtered by name
router.get("/districts", getDistrictByName);
router.get("/districts/all", allDistricts);

module.exports = router;
