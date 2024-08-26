import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/home/HeroSection";
import ElectionInfoSection from "../components/home/ElectionInfoSection";
import AdvertisementsList from "../components/home/AdvertisementsList";
import Modal from "../components/home/ModalHome"; // Adjust the path as needed

const Home = () => {
  const [voterInfo, setVoterInfo] = useState({
    voterName: "",
    district: "",
    electionDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [roomIds, setRoomIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoterInfo = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/user/district-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // or any other method to retrieve the token
          },
        });

        // Assuming the API response contains the voter info in the format you need
        setVoterInfo({
          voterName: response.data.full_name,
          district: response.data.name,
          electionDate: "2024-11-05T00:00:00", // Use appropriate date if provided by API
        });
      } catch (error) {
        console.error("Error fetching voter info:", error);
      }
    };

    fetchVoterInfo();
  }, []);

  useEffect(() => {
    const storedRoomIds = JSON.parse(localStorage.getItem("roomIds")) || [];
    const isModalAlreadyShown = localStorage.getItem("modalShown");

    if (storedRoomIds.length > 0 && !isModalAlreadyShown) {
      setNotification("هناك بث مباشر جاري.");
      setRoomIds(storedRoomIds); // Store the list of room IDs
      setIsModalOpen(true); // Show the modal
      localStorage.setItem("modalShown", "true"); // Mark the modal as shown
    }
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNavigateToLiveStream = (roomId) => {
    navigate(`LiveStream/viewer/${roomId}?role=view`);
    setIsModalOpen(false); // Close the modal after navigating
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <p>{notification}</p>
        <ul className="mt-4">
          {roomIds.map((id, index) => (
            <li key={index} className="mb-2">
              <button
                className="bg-gradient-to-br from-white via-green-700 to-green-200 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                onClick={() => handleNavigateToLiveStream(id)}
              >
                الانتقال إلى غرفة رقم: {id}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
      <HeroSection
        className="hero-section"
        voterName={voterInfo.voterName}
        district={voterInfo.district}
        electionDate={voterInfo.electionDate}
      />
      <ElectionInfoSection className="election-info-section" />
      <AdvertisementsList />
    </div>
  );
};

export default Home;
