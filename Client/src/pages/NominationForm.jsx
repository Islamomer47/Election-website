import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomAlert = ({ title, description }) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong className="font-bold">{title}</strong>
    <span className="block sm:inline"> {description}</span>
  </div>
);

const NominationForm = () => {
  const [candidates, setCandidates] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login-with-password");
          return;
        }
        const usersDataResponse = await axios.get(
          "http://localhost:4000/api/get-by-token",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsersData(usersDataResponse);

        const allUsersByDistrictID = await axios.get(
          `http://localhost:4000/api/users-by-district/${usersDataResponse.data.user.district_id}`
        );
        const ctest = [];
        allUsersByDistrictID.data.users.forEach((user) => {
          ctest.push({
            id: user.national_id,
            name: user.full_name,
            email: user.email,
          });
        });
        setCandidates(ctest);
      } catch (error) {
        console.error("Error fetching users by district:", error);
      }
    })();
  }, []);

  const candidateTypes = [
    { value: "Muslim", label: "مسلم" },
    { value: "Christian", label: "مسيحي" },
    { value: "female_quota", label: "كوتا نسائي" },
    { value: "circassian_chechen", label: "شركس أو شيشان" },
  ];

  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [listName, setListName] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCandidateSelection = (event) => {
    const candidateId = parseInt(event.target.value);
    console.log("candidateId: ", candidateId);

    const candidate = candidates.find((c) => c.id == candidateId);
    console.log("candidate in handle candidate selection: ", candidate);
    if (candidate && !selectedCandidates.some((c) => c.id == candidate.id)) {
      setSelectedCandidates((prev) => [...prev, { ...candidate, type: "" }]);
    }
  };

  const removeCandidateFromSelection = (candidateId) => {
    setSelectedCandidates((prev) => prev.filter((c) => c.id !== candidateId));
  };

  const handleCandidateTypeChange = (candidateId, type) => {
    setSelectedCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, type } : c))
    );
  };

  const validateSelection = () => {
    const counts = {
      Muslim: 0,
      Christian: 0,
      female_quota: 0,
      circassian_chechen: 0,
    };

    selectedCandidates.forEach((candidate) => {
      if (counts[candidate.type] !== undefined) {
        counts[candidate.type]++;
      }
    });

    return (
      counts.Muslim === 7 &&
      counts.Christian === 1 &&
      counts.female_quota === 1 &&
      counts.circassian_chechen === 1 &&
      selectedCandidates.length === 10
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      if (validateSelection() && listName) {
        setShowSuccessDialog(true);

        console.log("اسم القائمة:", listName);
        const createdLocalList = await axios.post(
          "http://localhost:4000/api/local-list/create",
          {
            name: listName,
            district_id: usersData.data.user.district_id,
            createdAt: "2024-08-17 14:42:55.913+03",
            updateAt: "2024-08-17 14:42:55.913+03",
          }
        );
        const localListId = createdLocalList.data.localList.list_id;
        console.log("createLocalList: ", localListId);
        console.log("المرشحون:");
        selectedCandidates.forEach((candidate) => {
          axios.post("http://localhost:4000/api/candidate/create", {
            national_id: candidate.id,
            list_id: localListId,
            religion: candidate.type,
            gender: candidate.type === "female_quota" ? "Female" : "Male",
            createdAt: "2024-08-17 14:42:55.913+03",
            updateAt: "2024-08-17 14:42:55.913+03",
          });
          console.log(
            `- الاسم: ${candidate.name}, ID: ${candidate.id}, البريد الإلكتروني: ${candidate.email}, النوع: ${candidate.type}`
          );
          console.log("work");
          axios.put(
            `http://localhost:4000/api/change-to-candidate/${candidate.id}`
          );
        });
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-white to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          نموذج طلب ترشيح للقائمة المحلية
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="listName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              اسم القائمة المحلية
            </label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="أدخل اسم القائمة أو الحزب"
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
                    className="flex flex-col bg-gray-100 p-2 rounded"
                  >
                    <div className="flex justify-between items-center">
                      {candidate.name}
                      <button
                        type="button"
                        onClick={() =>
                          removeCandidateFromSelection(candidate.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                    <select
                      value={candidate.type}
                      onChange={(e) =>
                        handleCandidateTypeChange(candidate.id, e.target.value)
                      }
                      className="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">اختر نوع المرشح</option>
                      {candidateTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <CustomAlert
            title="تنبيه:"
            description="يجب اختيار 10 مرشحين: 7 مسلمين، 1 مسيحي، 1 كوتا نسائي، و1 شركس أو شيشان."
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!validateSelection() || !listName}
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

export default NominationForm;
