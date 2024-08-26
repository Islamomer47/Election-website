const jwt = require("jsonwebtoken");
const { User, ElectoralDistrict, Candidate, LocalList } = require("../models");
const { Op } = require("sequelize");

const THRESHOLD_PERCENTAGE = 0.05;
//اجيب اليوزر لاي دائرة تابع (هوم و داش)
getUserDistrictInfo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and extract the user's national ID
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const nationalId = decoded.national_id;

    // Find the user by national ID
    const user = await User.findOne({ where: { national_id: nationalId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the electoral district by the user's district ID
    const district = await ElectoralDistrict.findOne({
      where: { district_id: user.district_id },
    });

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    // Send the response with user full name and district information
    res.json({
      full_name: user.full_name,
      district_id: district.district_id,
      name: district.name,
      city: district.city,
    });
  } catch (error) {
    console.error("Error retrieving district info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserByToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token and extract the user's national ID
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const nationalId = decoded.national_id;

  try {
    const user = await User.findByPk(nationalId);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllcandidateUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { user_type: "candidate", district_id: req.params.id },
    });
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllVoteUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { user_type: "voter" },
    });
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCnadidateInfo = async (req, res) => {
  try {
    const candidate = await User.findOne({
      where: { national_id: req.params.id },
    });
    res.json({ candidate });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

getAllDistricts = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const nationalId = decoded.national_id;

    const user = await User.findOne({ where: { national_id: nationalId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const districts = await ElectoralDistrict.findAll();

    const districtData = districts.map(district => ({
      id: district.district_id,
      name: district.name,
      city: district.city,
      number_of_seats: district.number_of_seats,
      female_seat: district.Female_seat,
      circassian_or_chechen_seat: district.Circassian_or_Chechen_seat,
      christian_seat: district.Christian_seat,
      isUserDistrict: district.district_id === user.district_id,
    }));

    res.json(districtData);
  } catch (error) {
    console.error("Error retrieving districts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const isVoteLocal = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { national_id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("user", user);
    user.is_voted_local = true;
    await user.save();

    res.json({
      message: "Local vote boolean updated",
      blankVotes: user.is_voted_local,
    });
  } catch (error) {
    console.error("Error increasing blank vote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const isVoteParty = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { national_id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("user", user);
    user.is_voted_party = true;
    await user.save();

    res.json({
      message: "Party vote boolean updated",
      blankVotes: user.is_voted_party,
    });
  } catch (error) {
    console.error("Error increasing blank vote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserIDByName = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { full_name: req.params.name },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({
      national_id: user.national_id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

getUserCount = async (req, res) => {
  try {
    const userCount = await User.count();
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the user count." });
  }
};

getVotedLocalPercentage = async (req, res) => {
  try {
    const percentage = await User.getVotedLocalPercentage();
    res.json({ percentage });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsersByDistrictId = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { district_id: req.params.id, user_type: "voter" },
    });
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changeFromVoterToCandidate = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.user_type = "candidate";
    await user.save();
    res.json({ message: "User type updated to candidate" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllWinnersForDistrict = async (req, res) => {
  const { district_id } = req.params;

  try {
    // Fetch district information
    const district = await ElectoralDistrict.findByPk(district_id);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    // Determine the number of seats for each category
    const christianSeat = district.Christian_seat ? 1 : 0;
    const circassianOrChechenSeat = district.Circassian_or_Chechen_seat ? 1 : 0;
    const femaleQuotaSeat = district.Female_seat ? 1 : 0;

    // Calculate the total number of seats allocated to Muslims
    const muslimSeats =
      district.number_of_seats -
      christianSeat -
      circassianOrChechenSeat -
      femaleQuotaSeat;

    // Fetch local lists and candidates for the given district
    const localLists = await LocalList.findAll({
      where: { district_id: district_id },
      include: [
        {
          model: Candidate,
          attributes: ["national_id", "list_id", "votes", "religion", "gender"],
          include: [
            {
              model: User,
              attributes: ["full_name"],
              required: true,
            },
          ],
          required: true,
        },
      ],
    });

    // Calculate the total number of voters in the district
    const totalVoters = await User.count({
      where: { user_type: "voter", district_id: district_id },
    });

    const localThreshold = totalVoters * 0.07;

    // Filter local lists that surpassed the threshold
    const qualifiedLocalLists = localLists.filter(list => {
      const totalVotesForList = list.Candidates.reduce(
        (sum, candidate) => sum + candidate.votes,
        0
      );
      return totalVotesForList > localThreshold;
    });

    if (qualifiedLocalLists.length === 0) {
      return res
        .status(404)
        .json({ message: "No qualified local lists found" });
    }

    // Calculate the total votes for qualified local lists
    const totalQualifiedVotes = qualifiedLocalLists.reduce((sum, list) => {
      const totalVotesForList = list.Candidates.reduce(
        (sum, candidate) => sum + candidate.votes,
        0
      );
      return sum + totalVotesForList;
    }, 0);

    // Track selected candidates to avoid duplicates
    const selectedCandidates = new Set();

    // Helper function to get the top candidate for a specific category
    const getTopCandidate = (candidates, category) => {
      return candidates
        .filter(c => c.religion === category)
        .sort((a, b) => b.votes - a.votes)
        .find(candidate => !selectedCandidates.has(candidate.national_id));
    };

    // Select the top candidate from each category if applicable
    const electedChristian = christianSeat
      ? getTopCandidate(
          localLists.flatMap(list => list.Candidates),
          "Christian"
        )
      : null;

    if (electedChristian) {
      selectedCandidates.add(electedChristian.national_id);
    }

    const electedCircassianOrChechen = circassianOrChechenSeat
      ? getTopCandidate(
          localLists.flatMap(list => list.Candidates),
          "circassian_chechen"
        )
      : null;

    if (electedCircassianOrChechen) {
      selectedCandidates.add(electedCircassianOrChechen.national_id);
    }

    const electedFemaleQuota = femaleQuotaSeat
      ? getTopCandidate(
          localLists.flatMap(list => list.Candidates),
          "female_quota"
        )
      : null;

    if (electedFemaleQuota) {
      selectedCandidates.add(electedFemaleQuota.national_id);
    }

    // Recalculate Muslim seats after reserving the seats for other categories
    const adjustedMuslimSeats =
      muslimSeats -
      (electedChristian ? 1 : 0) -
      (electedCircassianOrChechen ? 1 : 0) -
      (electedFemaleQuota ? 1 : 0);

    // Calculate winning seats for Muslims in each qualified local list
    const localResults = qualifiedLocalLists.map(list => {
      const totalVotesForList = list.Candidates.reduce(
        (sum, candidate) => sum + candidate.votes,
        0
      );
      const seatShare =
        (totalVotesForList / totalQualifiedVotes) * adjustedMuslimSeats;
      const seatsWon = Math.round(seatShare);
      return { ...list.toJSON(), seatsWon };
    });

    // Select Muslim candidates based on the number of seats their list has won
    const electedMuslims = [];
    localResults.forEach(list => {
      const listCandidates = list.Candidates.filter(
        c => c.religion === "Muslim"
      ).sort((a, b) => b.votes - a.votes);
      listCandidates.slice(0, list.seatsWon).forEach(candidate => {
        if (!selectedCandidates.has(candidate.national_id)) {
          electedMuslims.push(candidate);
          selectedCandidates.add(candidate.national_id);
        }
      });
    });

    // Combine all elected candidates
    let allElectedCandidates = [
      ...electedMuslims,
      electedChristian,
      electedCircassianOrChechen,
      electedFemaleQuota,
    ].filter(Boolean); // Filter out any null values

    // Ensure the total number of winners does not exceed the district's seats
    if (allElectedCandidates.length > district.number_of_seats) {
      allElectedCandidates = allElectedCandidates.slice(
        0,
        district.number_of_seats
      );
    }

    res.json({ electedCandidates: allElectedCandidates });
  } catch (error) {
    console.error("Error calculating elected candidates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllcandidateUsersFromAnyDistrict = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { user_type: "candidate" },
    });
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  getAllDistricts,
  getUserDistrictInfo,
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
};
