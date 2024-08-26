import React, { useState, useEffect } from "react";
import axios from "axios";

const ElectionResults = () => {
  const [localListResults, setLocalListResults] = useState([]);
  const [partyListResults, setPartyListResults] = useState([]);
  const [electedCandidates, setElectedCandidates] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchElectionData();
  }, []);

  useEffect(() => {
    if (data) {
      calculateResults();
    }
  }, [data]);

  const fetchElectionData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/election-results"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching election data:", error);
    }
  };

  const calculateResults = () => {
    const { localLists, partyLists, totalVoters, muslimSeats } = data;

    const localThreshold = totalVoters * 0.07;
    const qualifiedLocalLists = localLists.filter(
      (list) => list.votes > localThreshold
    );
    const totalQualifiedVotes = qualifiedLocalLists.reduce(
      (sum, list) => sum + list.votes,
      0
    );

    const localResults = qualifiedLocalLists.map((list) => {
      const seatShare = (list.votes / totalQualifiedVotes) * muslimSeats;
      const seatsWon =
        seatShare - Math.floor(seatShare) < 0.5 ||
        seatShare - Math.floor(seatShare) === 0.5
          ? Math.floor(seatShare)
          : Math.ceil(seatShare);
      return { ...list, seatsWon };
    });

    setLocalListResults(localResults);

    const electedMuslims = [];
    localResults.forEach((list) => {
      const listCandidates = list.Candidates.filter(
        (c) => c.religion === "Muslim"
      ).sort((a, b) => b.votes - a.votes);
      electedMuslims.push(...listCandidates.slice(0, list.seatsWon));
    });

    const categories = ["Christian", "Circassian", "Chechen"];
    const electedOthers = categories.map(
      (category) =>
        localLists
          .flatMap((list) => list.Candidates)
          .filter((c) => c.religion === category)
          .sort((a, b) => b.votes - a.votes)[0]
    );

    const electedWomen = localLists
      .flatMap((list) => list.Candidates)
      .filter((c) => c.gender === "Female")
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 1);

    setElectedCandidates([
      ...electedMuslims,
      ...electedOthers,
      ...electedWomen,
    ]);

    const partyThreshold = totalVoters * 0.025;
    const qualifiedPartyLists = partyLists.filter(
      (list) => list.votes > partyThreshold
    );
    const totalQualifiedPartyVotes = qualifiedPartyLists.reduce(
      (sum, list) => sum + list.votes,
      0
    );

    const partyResults = qualifiedPartyLists.map((list) => {
      const seatShare = (list.votes / totalQualifiedPartyVotes) * 41;
      const seatsWon = Math.round(seatShare);
      return { ...list, seatsWon };
    });

    setPartyListResults(partyResults);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          marginBottom: "16px",
          border: "1px solid #ddd",
          padding: "16px",
        }}
      >
        <h2 style={{ marginBottom: "8px" }}>Local List Results</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                List Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Votes
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Seats Won
              </th>
            </tr>
          </thead>
          <tbody>
            {localListResults.map((list) => (
              <tr key={list.list_id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {list.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {list.votes}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {list.seatsWon}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginBottom: "16px",
          border: "1px solid #ddd",
          padding: "16px",
        }}
      >
        <h2 style={{ marginBottom: "8px" }}>Elected Candidates</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Religion
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Gender
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Votes
              </th>
            </tr>
          </thead>
          <tbody>
            {electedCandidates.map((candidate) => (
              <tr key={candidate.candidate_id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {candidate.User.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {candidate.religion}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {candidate.gender}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {candidate.votes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "16px" }}>
        <h2 style={{ marginBottom: "8px" }}>Party List Results</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                List Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Votes
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Seats Won
              </th>
            </tr>
          </thead>
          <tbody>
            {partyListResults.map((list) => (
              <tr key={list.list_id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {list.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {list.votes}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {list.seatsWon}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElectionResults;
