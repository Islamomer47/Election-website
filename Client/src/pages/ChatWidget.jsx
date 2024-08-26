import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voterInfo, setVoterInfo] = useState({
    voterName: "",
    district: "",
    electionDate: "",
  });

  const loadingVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const [commonQuestions, setCommonQuestions] = useState([
    "مرحبا",
    "كيف حالك",
    "السلام عليكم",
    "أريد أن أسألك",
    "ما هو اسمك؟",
    "هل يمكنك مساعدتي؟",
    "شكراً لك",
    "وداعاً",
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    const fetchVoterInfo = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/user/district-info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const fullName = response.data.full_name;
        const firstName = fullName.split(" ")[0];

        setVoterInfo({
          voterName: firstName,
          district: response.data.name,
          electionDate: "2024-11-05T00:00:00",
        });
      } catch (error) {
        console.error("Error fetching voter info:", error);
      }
    };

    fetchVoterInfo();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setResponses([...responses, { message, response: null }]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/chat", {
        message,
      });
      setTimeout(() => {
        setResponses((prev) =>
          prev.map((chat, index) =>
            index === prev.length - 1
              ? { ...chat, response: res.data.response }
              : chat
          )
        );
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);
      setIsLoading(false);
    }
  };

  const handleQuestionClick = async (question) => {
    setMessage(question);
    await sendMessage(question);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Toggle Chat Button */}
      <div
        className={`fixed bottom-24 right-12 z-50 cursor-pointer ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={toggleChat}
      >
        <button className="p-4 w-[80px] h-[80px] bg-gradient-to-r from-green-500 to-green-700 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-500 transition duration-300 flex items-center justify-center">
          <svg
            width="36px"
            height="36px"
            viewBox="0 0 24 24"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path d="M11.999 0c-2.25 0-4.5.06-6.6.21a5.57 5.57 0 0 0-5.19 5.1c-.24 3.21-.27 6.39-.06 9.6a5.644 5.644 0 0 0 5.7 5.19h3.15v-3.9h-3.15c-.93.03-1.74-.63-1.83-1.56-.18-3-.15-6 .06-9 .06-.84.72-1.47 1.56-1.53 2.04-.15 4.2-.21 6.36-.21s4.32.09 6.36.18c.81.06 1.5.69 1.56 1.53.24 3 .24 6 .06 9-.12.93-.9 1.62-1.83 1.59h-3.15l-6 3.9V24l6-3.9h3.15c2.97.03 5.46-2.25 5.7-5.19.21-3.18.18-6.39-.03-9.57a5.57 5.57 0 0 0-5.19-5.1c-2.13-.18-4.38-.24-6.63-.24zm-5.04 8.76c-.36 0-.66.3-.66.66v2.34c0 .33.18.63.48.78 1.62.78 3.42 1.2 5.22 1.26 1.8-.06 3.6-.48 5.22-1.26.3-.15.48-.45.48-.78V9.42c0-.09-.03-.15-.09-.21a.648.648 0 0 0-.87-.36c-1.5.66-3.12 1.02-4.77 1.05-1.65-.03-3.27-.42-4.77-1.08a.566.566 0 0 0-.24-.06z" />
          </svg>
        </button>
      </div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            className="fixed bottom-4 right-0 z-50 w-80 h-[500px] bg-white shadow-2xl rounded-lg flex flex-col"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-[30rem]">
              {/* Common Questions */}
              <div className="p-4 border-b h-40 border-gray-400 overflow-y-auto  text-white">
                <h3 className="font-semibold text-gray-50 mb-2">
                  الأسئلة الشائعة
                </h3>
                <div className="flex flex-col mt-2 ">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="p-2 mb-2 bg-gray-400 text-white rounded shadow-sm hover:bg-gray-600 transition duration-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 border-t border-gray-200 bg-gray-50">
                {responses.map((chat, index) => (
                  <div key={index} className="mb-4">
                    <div className="font-semibold text-red-700">
                      {voterInfo.voterName
                        ? `${voterInfo.voterName}:`
                        : "Loading..."}
                    </div>
                    <div className="bg-red-200 p-2 rounded shadow-sm">
                      {chat.message}
                    </div>
                    <div className="font-semibold text-gray-800 mt-2">
                      الروبوت:
                    </div>
                    <div className="bg-green-200 p-2 rounded shadow-sm">
                      {chat.response ? (
                        chat.response
                      ) : (
                        <div className="flex">
                          <motion.div
                            className="h-2 w-2 bg-green-400 rounded-full"
                            variants={loadingVariants}
                            animate="animate"
                            style={{ marginRight: "8px" }} // Adjust as needed
                          />
                          <motion.div
                            className="h-2 w-2 bg-green-400 rounded-full"
                            variants={loadingVariants}
                            animate="animate"
                            style={{ marginRight: "8px" }} // Adjust as needed
                          />
                          <motion.div
                            className="h-2 w-2 bg-green-400 rounded-full"
                            variants={loadingVariants}
                            animate="animate"
                            style={{ marginRight: "8px" }} // Adjust as needed
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center items-center mt-2">
                    <div className="flex">
                      <motion.div
                        className="h-2 w-2 bg-green-400 rounded-full"
                        variants={loadingVariants}
                        animate="animate"
                        style={{ marginRight: "8px" }} // Adjust as needed
                      />
                      <motion.div
                        className="h-2 w-2 bg-green-400 rounded-full"
                        variants={loadingVariants}
                        animate="animate"
                        style={{ marginRight: "8px" }} // Adjust as needed
                      />
                      <motion.div
                        className="h-2 w-2 bg-green-400 rounded-full"
                        variants={loadingVariants}
                        animate="animate"
                        style={{ marginRight: "8px" }} // Adjust as needed
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(message)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="اكتب رسالتك..."
                />
                <button
                  onClick={() => sendMessage(message)}
                  className="w-full mt-2 bg-green-700 text-white py-2 rounded-lg"
                >
                  إرسال
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
