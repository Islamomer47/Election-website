// routes/electoralDistrictRoutes.js
const express = require("express");
const router = express.Router();
const electoralDistrictController = require("../controllers/electoralDistrictController");

router.get(
  "/districts/count",
  electoralDistrictController.getElectoralDistrictCount
);

router.get("/search", electoralDistrictController.searchElectoralDistricts);

module.exports = router;
