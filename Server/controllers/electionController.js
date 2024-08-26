const { PartyList, ElectoralDistrict } = require("../models");

async function getPartyListResults(req, res) {
  try {
    const districtId = req.params.districtId;

    // Fetch the total number of voters for the district
    const district = await ElectoralDistrict.findOne({
      where: { district_id: districtId },
      attributes: ["number_of_seats"], // Use this or another field to represent total voters
    });

    if (!district) {
      return res.status(404).json({ error: "Electoral district not found" });
    }

    const totalVoters = district.number_of_seats; // or another appropriate field
    const partyThreshold = totalVoters * 0.025;

    // Fetch all party lists
    const partyLists = await PartyList.findAll();

    // Filter party lists that passed the threshold
    const qualifiedPartyLists = partyLists.filter(
      (list) => list.votes > partyThreshold
    );

    // Calculate the total votes for qualified lists
    const totalQualifiedPartyVotes = qualifiedPartyLists.reduce(
      (sum, list) => sum + list.votes,
      0
    );

    // Calculate seats for each qualified party list
    const partyResults = qualifiedPartyLists.map((list) => {
      const seatShare = (list.votes / totalQualifiedPartyVotes) * 41; // Assuming 41 is the total number of seats
      const seatsWon = Math.round(seatShare);
      return { ...list.toJSON(), seatsWon };
    });

    // Send the results back to the client
    res.json(partyResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getPartyListResults };
