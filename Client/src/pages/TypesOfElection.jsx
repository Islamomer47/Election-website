import React, { useState, useEffect } from "react";
import { UserCircle, ListChecks, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VoterListSelection = () => {
  const [selectedList, setSelectedList] = useState(null);
  const navigate = useNavigate();

  const handleSelection = (listType) => {
    setSelectedList(listType);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-500 via-white to-red-500 flex items-center justify-center p-4 overflow-hidden"
      dir="rtl"
    >
      <motion.div
        className="max-w-4xl w-full bg-white bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-black text-white p-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="relative inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-red-600 rounded-full transform rotate-45 scale-75"></div>
            <UserCircle className="relative z-10 h-16 w-16 text-white" />
          </motion.div>
          <motion.h1
            className="mt-4 text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            مرحبًا بك، أيها الناخب الأردني!
          </motion.h1>
          <motion.p
            className="mt-2 text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            يرجى اختيار نوع القائمة التي ترغب في التصويت لها:
          </motion.p>
        </motion.div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              type: "local",
              title: "القائمة المحلية",
              icon: ListChecks,
              color: "green",
              description: "صوّت للمرشحين في دائرتك الانتخابية المحلية.",
            },
            {
              type: "party",
              title: "قائمة الأحزاب",
              icon: Users,
              color: "red",
              description: "صوّت للأحزاب السياسية على المستوى الوطني.",
            },
          ].map((list, index) => (
            <motion.div
              key={list.type}
              variants={listVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedList === list.type
                  ? `ring-4 ring-${list.color}-500 shadow-lg`
                  : ""
              }`}
              onClick={() => handleSelection(list.type)}
            >
              <div
                className={`p-4 bg-gradient-to-r from-${list.color}-600 to-${list.color}-400`}
              >
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <list.icon className="ml-2 h-6 w-6" />
                  {list.title}
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-700 text-sm">{list.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="px-6 pb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button
            disabled={!selectedList}
            className={`px-8 py-3 bg-black text-white text-lg font-semibold rounded-full transition-all duration-300 ${
              selectedList
                ? "hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transform hover:scale-105 hover:shadow-lg"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => navigate(`/voting/${selectedList}`)}
          >
            المتابعة إلى التصويت
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VoterListSelection;
