import React, { useState, useEffect } from "react";
import { ArrowRight, UserCircle, CheckCircle } from "lucide-react";
import Popup from "../components/popup";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VotingPage = () => {
  const [users, setUsers] = useState(null);
  const [localLists, setLocalLists] = useState(null);
  const [partyLists, setPartyLists] = useState(null);
  const [isLocalVoted, setIsLocalVoted] = useState(false);
  const [isPartyVoted, setIsPartyVoted] = useState(false);
  const { listtype } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isBlankVote, setIsBlankVote] = useState(false);
  const [llist, setLlist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("accessToken");
      console.log("token", token);
      if (!token) {
        navigate("/login-with-password");
        return;
      }
      const usersData = await axios.get(
        "http://localhost:4000/api/get-by-token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(usersData.data);
      const localListData = await axios.get(
        "http://localhost:4000/api/local-list/get"
      );
      console.log("localListData", localListData.data);
      const filteredLocalLists = Object.values(localListData.data)[0].filter(
        list => {
          return list.district_id === usersData.data.user.district_id;
        }
      );
      console.log("filteredLocalLists", filteredLocalLists);
      setLocalLists(filteredLocalLists);
      // console.log(localLists);

      const getAllcandidateUsers = await axios.get(
        `http://localhost:4000/api/candidate/${usersData.data.user.district_id}`
      );
      // console.log(getAllcandidateUsers.data);

      // const partyListData = await axios.get(
      //   "http://localhost:4000/api/party-list/get"
      // );
      // setPartyLists(partyListData.data);
      const partyListData = await axios.get(
        "http://localhost:4000/api/party-list/get"
      );
      console.log("partList : ", partyListData.data.partyLists);
      const plist = [];
      const logos = ["🌟", "🌿", "😁", "💎"];
      partyListData.data.partyLists.forEach((party, index) => {
        plist.push({
          id: party.list_id,
          name: party.name,
          logo: logos[index],
        });
      });
      setPartyLists(plist);
      console.log("localListData: ", localListData.data.localLists);

      const llist1 = [];
      const candidatesByList = {};
      const candidatesByListWithNames = {};
      // console.log(Object.values(getAllcandidateUsers.data)[0]);

      for (
        let i = 0;
        i < Object.values(getAllcandidateUsers.data)[0].length;
        i++
      ) {
        try {
          const candidateData = await axios.get(
            `http://localhost:4000/api/candidate/candidate/${
              Object.values(getAllcandidateUsers.data)[0][i].national_id
            }`
          );
          console.log("candidateData", candidateData.data);
          if (Object.values(candidateData.data)[0]) {
            const listId = Object.values(candidateData.data)[0].list_id;
            const nationalId = Object.values(candidateData.data)[0].national_id;

            // Get full name for this national ID
            const usersData = await axios.get(
              `http://localhost:4000/api/get/${nationalId}`
            );
            const fullName = usersData.data.user.full_name; // Adjust this based on the actual structure of your API response

            // If this list_id doesn't exist in our objects yet, initialize them
            if (!candidatesByList[listId]) {
              candidatesByList[listId] = {
                id: listId,
                national_ids: [],
              };
              candidatesByListWithNames[listId] = {
                id: listId,
                candidates: [],
                name: filteredLocalLists.find(list => list.list_id === listId)
                  .name,
              };
            }

            // Add the national_id and full name to the respective arrays for this list_id
            candidatesByList[listId].national_ids.push(nationalId);
            candidatesByListWithNames[listId].candidates.push(fullName);
          }
        } catch (error) {
          console.error(
            `Error fetching data for candidate at index ${i}:`,
            error
          );
        }
      }

      // Convert the objects to arrays if needed
      const resultArrayWithIds = Object.values(candidatesByList);
      const resultArrayWithNames = Object.values(candidatesByListWithNames);
      console.log("resultArrayWithNames", resultArrayWithNames);

      // console.log("Candidates by List (with National IDs):", candidatesByList);
      // console.log(
      //   "Candidates by List (with Full Names):",
      //   candidatesByListWithNames
      // );
      // console.log("Result Array (with National IDs):", resultArrayWithIds);
      // console.log("Result Array (with Full Names):", resultArrayWithNames);
      llist1.push(resultArrayWithNames);
      setLlist(llist1);
      setIsLocalVoted(usersData.data.user.is_voted_local);
      setIsPartyVoted(usersData.data.user.is_voted_party);
    })();
  }, []);
  // console.log(llist && llist[0]);
  const lists = {
    local: llist && llist[0],
    party: partyLists && partyLists,
  };
  console.log(lists);
  const selectedLists = lists[listtype];

  const handleListClick = list => {
    if (
      (listtype === "local" && isLocalVoted) ||
      (listtype === "party" && isPartyVoted)
    ) {
      return;
    }
    setSelectedList(prevList =>
      prevList && prevList.id === list.id ? null : list
    );
    if (list.id !== selectedList?.id) {
      setSelectedCandidates(prev => ({
        [list.id]: prev[list.id] || {},
      }));
    }
  };

  const handleCandidateClick = (e, listId, candidate) => {
    e.stopPropagation();
    if (
      selectedList &&
      selectedList.id === listId &&
      !(
        (listtype === "local" && isLocalVoted) ||
        (listtype === "party" && isPartyVoted)
      )
    ) {
      setSelectedCandidates(prev => ({
        ...prev,
        [listId]: {
          ...prev[listId],
          [candidate]: !prev[listId]?.[candidate],
        },
      }));
    }
  };

  const handleVote = () => {
    if (
      selectedList &&
      !(
        (listtype === "local" && isLocalVoted) ||
        (listtype === "party" && isPartyVoted)
      )
    ) {
      setIsBlankVote(false);
      setShowPopup(true);
    } else if (!selectedList) {
      setIsBlankVote(true);
      setShowPopup(true);
    }
  };

  const handleConfirmVote = () => {
    if (isBlankVote) {
      if (listtype === "local") {
        const districtId = users.user.district_id;
        const userId = users.user.national_id;
        console.log("userID", userId);
        console.log("districtId", districtId);
        axios.post(`http://localhost:4000/api/election/district/${districtId}`);
        axios.post(`http://localhost:4000/api/is-vote-local/${userId}`);
        console.log(`Blank vote cast for Local list`);
      }
      if (listtype === "party") {
        console.log(`Blank vote cast for Party list
        `);
        axios.post(
          `http://localhost:4000/api/is-vote-party/${users.user.national_id}`
        );
        axios.post(`http://localhost:4000/api/election/party`);
      }
    } else {
      const votedCandidates = selectedCandidates[selectedList.id] || {};
      console.log(`Voted for: ${selectedList.name}`);
      console.log(
        "Selected candidates:",
        Object.keys(votedCandidates).filter(c => votedCandidates[c])
      );
      if (listtype === "local") {
        if (
          Object.keys(votedCandidates).filter(c => votedCandidates[c])
            .length === 0
        ) {
          axios.post(
            `http://localhost:4000/api/is-vote-local/${users.user.national_id}`
          );
          axios.post(
            `http://localhost:4000/api/local-list/increase-vote/${selectedList.name}`
          );
        } else {
          console.log(
            Object.keys(votedCandidates).filter(c => votedCandidates[c])
          );
          axios.post(
            `http://localhost:4000/api/is-vote-local/${users.user.national_id}`
          );
          axios.post(
            `http://localhost:4000/api/local-list/increase-vote/${selectedList.name}`
          );
          for (
            let i = 0;
            i <
            Object.keys(votedCandidates).filter(c => votedCandidates[c]).length;
            i++
          ) {
            axios
              .get(
                `http://localhost:4000/api/user-id/${
                  Object.keys(votedCandidates).filter(c => votedCandidates[c])[
                    i
                  ]
                }`
              )
              .then(res => {
                return res.data.national_id;
              })
              .then(national_id => {
                axios.post(
                  `http://localhost:4000/api/candidate/vote/${national_id}`
                );
              });
          }
        }
      }
      if (listtype === "party") {
        console.log("Voted for test: ", selectedList.name);
        axios.post(
          `http://localhost:4000/api/is-vote-party/${users.user.national_id}`
        );
        axios.put(
          `http://localhost:4000/api/party-list/increase/${selectedList.name}`
        );
      }
    }
    setShowPopup(false);
    setSelectedList(null);
    setSelectedCandidates({});
    if (listtype === "local") {
      setIsLocalVoted(true);
    } else if (listtype === "party") {
      setIsPartyVoted(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-500 via-white to-red-500 py-12 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <Popup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={handleConfirmVote}
        isBlankVote={isBlankVote}
      />
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowRight className="mx-auto h-12 w-12 text-white" />
          <h1 className="mt-4 text-3xl font-bold text-black">
            {listtype === "local" ? "القوائم المحلية" : "قوائم الأحزاب"}
          </h1>
          <p className="mt-2 text-lg text-black">
            يرجى اختيار القائمة التي ترغب في التصويت لها
          </p>
          {((listtype === "local" && isLocalVoted) ||
            (listtype === "party" && isPartyVoted)) && (
            <p className="mt-2 text-3xl text-red-600 font-extrabold">
              لقد قمت بالتصويت بالفعل لهذه القائمة. لا يمكنك التصويت مرة أخرى.
            </p>
          )}
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedLists &&
            selectedLists.map((list, index) => {
              const isSelected = selectedList && selectedList.id === list.id;
              const isDisabled =
                (selectedList && selectedList.id !== list.id) ||
                (listtype === "local" && isLocalVoted) ||
                (listtype === "party" && isPartyVoted);

              return (
                <motion.div
                  key={list.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                    isDisabled
                      ? "opacity-50 scale-95"
                      : "hover:shadow-lg transform hover:-translate-y-1"
                  }`}
                >
                  <div
                    className={`p-5 bg-gradient-to-r ${
                      listtype === "local"
                        ? "from-green-600 to-green-400"
                        : "from-red-600 to-red-400"
                    } border-b cursor-pointer`}
                    onClick={() => handleListClick(list)}
                  >
                    <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                      <span className="flex items-center">
                        {listtype === "local" ? (
                          <UserCircle className="ml-2 h-6 w-6 text-white" />
                        ) : (
                          <div className="ml-2 text-2xl">{list.logo}</div>
                        )}
                        {list.name}
                      </span>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-yellow-400" />
                      )}
                    </h3>
                  </div>
                  <div className="px-5 py-3">
                    {listtype === "local" && (
                      <ul className="text-gray-800 list-none">
                        {list.candidates.map((candidate, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 py-1"
                          >
                            <input
                              type="checkbox"
                              className={`form-checkbox h-5 w-5 transition duration-150 ease-in-out ${
                                isDisabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-green-600"
                              }`}
                              checked={
                                selectedCandidates[list.id]?.[candidate] ||
                                false
                              }
                              onChange={e =>
                                handleCandidateClick(e, list.id, candidate)
                              }
                              disabled={isDisabled}
                            />
                            <span className={isDisabled ? "text-gray-400" : ""}>
                              {candidate}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            className={`px-6 py-3 text-white text-lg font-semibold rounded-full transition-all duration-300 ${
              !(
                (listtype === "local" && isLocalVoted) ||
                (listtype === "party" && isPartyVoted)
              )
                ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleVote}
            disabled={
              (listtype === "local" && isLocalVoted) ||
              (listtype === "party" && isPartyVoted)
            }
          >
            {selectedList ? "التصويت للقائمة المختارة" : "التصويت"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VotingPage;
