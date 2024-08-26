import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CustomAlert = ({ title, description }) => (
  <div
    className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong className="font-bold">{title}</strong>
    <span className="block sm:inline"> {description}</span>
  </div>
);

const PartyListNominationForm = () => {
  // const candidates = [
  //   { id: 1, name: "أحمد محمود", email: "ahmed@example.com" },
  //   { id: 2, name: "فاطمة علي", email: "fatima@example.com" },
  //   { id: 3, name: "محمد خالد", email: "mohammad@example.com" },
  //   { id: 4, name: "ليلى عمر", email: "layla@example.com" },
  //   { id: 5, name: "يوسف سمير", email: "yousef@example.com" },
  //   // Add more candidates as needed
  // ];
  const candidates1 = [];
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [votesUsers, setVotesUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
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
      if (!usersData.data.user.is_commissioner) {
        navigate("/");
        return;
      }
      console.log("userData", usersData.data);
      const votesUsers = await axios.get(
        "http://localhost:4000/api/vote-users"
      );
      setVotesUsers(votesUsers.data.users);
      console.log("votesUsers", votesUsers.data.users);
      votesUsers.data.users.forEach((user) => {
        candidates1.push({
          id: user.national_id,
          name: user.full_name,
          email: user.email,
        });
      });
      setCandidates(candidates1);
      console.log("candidates", candidates1);
    })();
  }, []);
  const handleCandidateSelection = (event) => {
    const candidateId = parseInt(event.target.value);
    const candidate = candidates.find((c) => c.id == candidateId);
    if (candidate && !selectedCandidates.some((c) => c.id == candidate.id)) {
      setSelectedCandidates((prev) => [...prev, candidate]);
    }
  };

  const removeCandidateFromSelection = (candidateId) => {
    setSelectedCandidates((prev) => prev.filter((c) => c.id !== candidateId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      if (selectedCandidates.length > 0 && partyName) {
        setShowSuccessDialog(true);

        console.log("اسم الحزب:", partyName);
        const addedPartyList = await axios.post(
          "http://localhost:4000/api/party-list/create",
          {
            name: partyName,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        );
        const partyListId = addedPartyList.data.list_id;
        console.log("تم إنشاء القائمة الحزبية بنجاح. ID:", partyListId);
        console.log("المرشحون:");
        selectedCandidates.forEach((candidate, index) => {
          axios.post("http://localhost:4000/api/party-list-candidate/create", {
            national_id: candidate.id,
            party_list_id: partyListId,
            rank: index + 1,
            createdAt: "2024-08-17 21:31:53.128+03",
            updatedAt: "2024-08-17 21:31:53.128+03",
          });
          axios.put(
            `http://localhost:4000/api/change-to-candidate/${candidate.id}`
          );
          console.log(
            `- الاسم: ${candidate.name}, ID: ${candidate.id}, البريد الإلكتروني: ${candidate.email}`
          );
        });
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-white to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          نموذج طلب ترشيح للقائمة الحزبية
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="partyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              اسم الحزب
            </label>
            <input
              id="partyName"
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="أدخل اسم الحزب"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اختر المرشحين
            </label>
            <select
              onChange={handleCandidateSelection}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">اختر مرشحًا</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCandidates.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">المرشحون المختارون:</h3>
              <ul className="space-y-2">
                {selectedCandidates.map((candidate) => (
                  <li
                    key={candidate.id}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span>{candidate.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCandidateFromSelection(candidate.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <CustomAlert
            title="ملاحظة:"
            description="يمكنك إضافة المرشحين الذين تريد ضمهم إلى القائمة الحزبية."
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={selectedCandidates.length === 0 || !partyName}
          >
            تقديم طلب الترشيح
          </button>
        </form>

        {showSuccessDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-xl font-bold mb-4">تم تقديم الطلب بنجاح</h2>
              <p className="mb-4">
                شكرًا لك على المشاركة في العملية الانتخابية.
              </p>
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
              >
                حسنًا
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyListNominationForm;
