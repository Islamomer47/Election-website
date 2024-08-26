const { ElectoralDistrict } = require("../models");

// Controller function to retrieve districts filtered by name if provided
const getDistrictByName = async (req, res) => {
  try {
    // Extract the 'name' query parameter from the request
    const { name } = req.query;

    // Fetch districts from the database, filtered by 'name' if it exists
    const districts = await ElectoralDistrict.findAll({
      where: name ? { name } : {}, // Apply filter only if 'name' is provided
    });

    // Send a 200 status response with the retrieved districts in JSON format
    res.status(200).json(districts);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ error: "Failed to retrieve districts" });
  }
};

// Controller function to retrieve all districts without any filters
const allDistricts = async (req, res) => {
  try {
    // Fetch all districts from the database
    const districts = await ElectoralDistrict.findAll();

    // Send a 200 status response with the retrieved districts in JSON format
    res.status(200).json(districts);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ error: "Failed to retrieve districts" });
  }
};

module.exports = {
  getDistrictByName,
  allDistricts,
};
