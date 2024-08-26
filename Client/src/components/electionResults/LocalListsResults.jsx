import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function useFetchLocalListResults(selectedDistrict) {
  const [localListResults, setLocalListResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalListResults = async () => {
      if (!selectedDistrict) {
        setLocalListResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: districtData } = await axios.get(
          "http://localhost:4000/api/districts",
          { params: { name: selectedDistrict } }
        );
        const districtId = districtData[0]?.district_id;

        if (districtId) {
          const { data: resultsData } = await axios.get(
            `http://localhost:4000/api/candidates/details/${districtId}`
          );
          setLocalListResults(resultsData.electedCandidates || []);
        } else {
          setLocalListResults([]);
        }
      } catch (error) {
        setError("فشل في جلب نتائج القوائم المحلية. حاول مرة أخرى.");
        console.error("Failed to fetch local list results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalListResults();
  }, [selectedDistrict]);

  return { localListResults, loading, error };
}

function LocalListsResults({ selectedDistrict }) {
  const { localListResults, loading, error } =
    useFetchLocalListResults(selectedDistrict);

  const handleExport = () => {
    // Prepare the data for export
    const dataToExport = localListResults.map((candidate) => ({
      User: candidate.User?.full_name || "اسم غير متوفر",
      Votes: candidate.votes || "غير متوفر",
      Religion: candidate.religion || "غير متوفر",
      Gender: candidate.gender || "غير متوفر",
    }));

    // Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: ["User", "Votes", "Religion", "Gender"],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Local List Results");
    XLSX.writeFile(wb, "local_list_results.xlsx");
  };

  if (loading) {
    return <div>جاري جلب النتائج...</div>;
  }

  if (error) {
    return (
      <div>
        {error}{" "}
        <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
      </div>
    );
  }

  if (!localListResults.length) {
    return <div>لا توجد نتائج للدائرة المحددة.</div>;
  }

  return (
    <div
      style={{
        marginBottom: "16px",
        border: "1px solid #ddd",
        padding: "16px",
      }}
    >
      <h2 style={{ marginBottom: "8px" }}>نتائج القوائم المحلية</h2>
      <button
        onClick={handleExport}
        style={{
          marginBottom: "16px",
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        تصدير إلى Excel
      </button>
      <table
        style={{ width: "100%", borderCollapse: "collapse" }}
        aria-label="Local List Results"
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              اسم المرشح
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              الأصوات
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>الدين</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>الجنس</th>
          </tr>
        </thead>
        <tbody>
          {localListResults.map((candidate) => (
            <tr key={candidate.national_id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {candidate.User?.full_name || "اسم غير متوفر"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {candidate.votes || "غير متوفر"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {candidate.religion || "غير متوفر"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {candidate.gender || "غير متوفر"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LocalListsResults;
