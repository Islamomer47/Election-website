// Import the ElectoralDistrict model from the models directory and the Sequelize Op object
const { ElectoralDistrict } = require("../models");
const { Op } = require("sequelize");

// Function to get the total count of electoral districts
exports.getElectoralDistrictCount = async (req, res) => {
  try {
    // Use the count method to get the total number of records in the ElectoralDistrict table
    const count = await ElectoralDistrict.count();

    // Send a JSON response with the count of districts
    res.json({ count });
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error fetching district count:", error);

    // Send a 500 status code indicating an internal server error, with an error message in JSON format
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to search for electoral districts by name
exports.searchElectoralDistricts = async (req, res) => {
  // Extract the 'name' query parameter from the request URL
  const name = req.query.name;

  // Check if the 'name' parameter is not provided
  if (!name) {
    // If 'name' is missing, return a 400 status code (Bad Request) with an error message
    return res
      .status(400)
      .json({ error: "Query parameter 'name' is required" });
  }

  try {
    // Use the findAll method to search for districts where the name matches the provided query
    const districts = await ElectoralDistrict.findAll({
      where: {
        // Use the Op.iLike operator to perform a case-insensitive search
        name: {
          [Op.iLike]: `%${name}%`, // '%' are wildcards that allow partial matches
        },
      },
    });

    // If no districts were found, return a 404 status code (Not Found) with a message
    if (districts.length === 0) {
      return res.status(404).json({ message: "No districts found" });
    }

    // If districts were found, send them as a JSON response
    res.json(districts);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error searching for districts:", error);

    // Send a 500 status code indicating an internal server error, with an error message and details
    res
      .status(500)
      .json({ error: "Failed to retrieve districts", details: error.message });
  }
};
