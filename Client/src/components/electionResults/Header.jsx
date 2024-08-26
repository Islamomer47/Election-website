import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Header({ activeTab, setActiveTab, VoiceSearch }) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    // Get the stored end time from localStorage
    const storedEndTime = localStorage.getItem("endTime");
    const now = Date.now();

    let endTime;
    if (storedEndTime && storedEndTime > now) {
      endTime = parseInt(storedEndTime);
    } else {
      // Set a new end time if not stored or expired
      endTime = now + 20 * 1000; // 10 hours from now
      localStorage.setItem("endTime", endTime);
    }

    const updateRemainingTime = () => {
      const remainingTime = Math.max(endTime - Date.now(), 0);
      setTimeRemaining(Math.floor(remainingTime / 1000));

      if (remainingTime <= 0) {
        setTimerActive(true);
        clearInterval(timerInterval);
      }
    };

    // Initial time update
    updateRemainingTime();

    const timerInterval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d} يوم ${h} ساعة ${m} دقيقة ${s} ثانية`;
  };

  return (
    <header className="bg-gradient-to-r from-red-700 via-green-700 to-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            نتائج الانتخابات البرلمانية الأردنية
          </motion.h1>
          {VoiceSearch}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white opacity-80 mt-2"
        >
          تاريخ الانتخابات: 15 آب 2024
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white opacity-80 mt-2"
        >
          انتهاء العد التنازلي: {formatTime(timeRemaining)}
        </motion.p>
        <div className="flex space-x-4 rtl:space-x-reverse mt-4">
          {["محلي", "حزبي"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full transition-all duration-300 ease-in-out ${
                activeTab === tab
                  ? "bg-white text-red-700 shadow-md"
                  : "bg-red-800 text-white hover:bg-red-900"
              } ${!timerActive && "cursor-not-allowed opacity-50"}`}
              onClick={() => timerActive && setActiveTab(tab)}
              disabled={!timerActive}
            >
              نتائج القوائم {tab}ة
            </motion.button>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
