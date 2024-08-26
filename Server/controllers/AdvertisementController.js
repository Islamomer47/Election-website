const { User, Advertisement } = require("../models");
const jwt = require("jsonwebtoken");

class AdvertisementController {
  // Retrieve all advertisements
  static async getAllAdvertisementsActive(req, res) {
    try {
      const advertisements = await Advertisement.findAll({
        where: {
          status: "active",
        },
      });
      return res.status(200).json(advertisements);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAllAdvertisementsInActive(req, res) {
    try {
      const advertisements = await Advertisement.findAll({
        where: {
          status: "inactive",
        },
      });
      return res.status(200).json(advertisements);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAllAdvertisements(req, res) {
    try {
      const advertisements = await Advertisement.findAll();
      return res.status(200).json(advertisements);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Retrieve a single advertisement by ID
  static async getAdvertisementById(req, res) {
    try {
      const { ad_id } = req.params;
      const advertisement = await Advertisement.findByPk(ad_id);

      if (!advertisement) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      return res.status(200).json(advertisement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Create a new advertisement
  static async createAdvertisement(req, res) {
    try {
      // Extract the token from the authorization header
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!decoded || !decoded.national_id) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const national_id = decoded.national_id;

      // Check if the user exists
      const userExists = await User.findOne({ where: { national_id } });
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }

      // Use the extracted national_id in the advertisement creation
      const advertisementData = {
        ...req.body,
        national_id, // Add national_id to the advertisement data
      };

      // Create the advertisement
      const advertisement = await Advertisement.create(advertisementData);

      return res.status(201).json(advertisement);
    } catch (error) {
      console.error("Error verifying token:", error); // Log the error for debugging
      return res.status(500).json({ error: error.message });
    }
  }

  // Update an advertisement by ID
  static async updateAdvertisement(req, res) {
    try {
      const { ad_id } = req.params;
      const [updated] = await Advertisement.update(req.body, {
        where: { ad_id },
      });

      if (!updated) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      const updatedAdvertisement = await Advertisement.findByPk(ad_id);
      return res.status(200).json(updatedAdvertisement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete an advertisement by ID
  static async deleteAdvertisement(req, res) {
    try {
      const { ad_id } = req.params;
      const deleted = await Advertisement.destroy({
        where: { ad_id },
      });

      if (!deleted) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      return res.status(204).send(); // No content
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateAdvertisementStatus(req, res) {
    try {
      // Extract the ad_id and new status from the request
      const { ad_id } = req.params;
      const { status } = req.body;

      // Validate the status value
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      // Find the advertisement by ad_id
      const advertisement = await Advertisement.findByPk(ad_id);

      if (!advertisement) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      // Update the status
      advertisement.status = status;
      await advertisement.save();

      return res.status(200).json(advertisement);
    } catch (error) {
      console.error("Error updating advertisement status:", error); // Log the error for debugging
      return res.status(500).json({ error: error.message });
    }
  }

  static async makeAdvertisementFromInactiveToActive(req, res) {
    try {
      const { ad_id } = req.params;
      const advertisement = await Advertisement.findByPk(ad_id);

      if (!advertisement) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      if (advertisement.status === "active") {
        return res
          .status(400)
          .json({ error: "Advertisement is already active" });
      }

      advertisement.status = "active";
      await advertisement.save();

      return res.status(200).json(advertisement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdvertisementController;
