import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function DistrictSelector({ selectedDistrict, setSelectedDistrict }) {
  const [districts, setDistricts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/districts`,
          {
            params: { name: selectedDistrict },
          }
        );
        setDistricts(response.data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      }
    };

    fetchDistricts();
  }, [selectedDistrict]);

  useEffect(() => {
    let endTime = localStorage.getItem("endTime");

    if (!endTime) {
      endTime = new Date().getTime() + 20 * 1000; // Set to 20 seconds for testing
      localStorage.setItem("endTime", endTime);
    }

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        setIsTimerFinished(true);
        localStorage.removeItem("endTime");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <label
        htmlFor="district-select"
        className="block text-xl font-medium text-red-800 mb-2"
      >
        اختر الدائرة:
      </label>
      {/* <div className="text-lg mb-4">
        {isTimerFinished ? (
          "الوقت انتهى! يمكنك الآن اختيار الدائرة."
        ) : (
          <span>
            الوقت المتبقي: {timeLeft.days} يوم {timeLeft.hours} ساعة{" "}
            {timeLeft.minutes} دقيقة {timeLeft.seconds} ثانية
          </span>
        )}
      </div> */}
      <select
        id="district-select"
        value={selectedDistrict || ""}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        className="w-full py-3 px-4 border-2 border-red-700 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition-all duration-300 ease-in-out"
        disabled={!isTimerFinished} // Disable until timer finishes
      >
        <option value="">جميع الدوائر</option>
        {districts.map((district) => (
          <option key={district.district_id} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

export default DistrictSelector;
