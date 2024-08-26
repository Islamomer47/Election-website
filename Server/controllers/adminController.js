const { Admin } = require("../models");

const getAdminData = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAdminData };
