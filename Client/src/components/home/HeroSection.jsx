import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import your AuthContext
import NotloggedHero from "./NotloggedHero";
import img1 from "../../assets/img/1.png";
import img2 from "../../assets/img/2.png";
import img3 from "../../assets/img/3.png";
import img4 from "../../assets/img/4.jpeg";
import axios from "axios";

const HeroSection = ({ voterName, district, electionDate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const images = [img1, img2, img3];
  const [voterCount, setVoterCount] = useState(null);
  const [districtCount, setDistrictCount] = useState(null);
  const [votedLocalPercentage, setVotedLocalPercentage] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [candidatesCount, setCandidatesCount] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }));
  }, [controls]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    controls.start({ x: mousePosition.x / 50, y: mousePosition.y / 50 });
  }, [mousePosition, controls]);

  const { isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState("");
  const [timeComponents, setTimeComponents] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const electionTime = new Date(electionDate).getTime();

    if (isNaN(electionTime)) {
      return {
        timeLeft: "تاريخ غير صالح",
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const distance = electionTime - now;

    if (distance < 0) {
      return {
        timeLeft: "يوم الانتخابات!",
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      timeLeft: `${days} يوم ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  useEffect(() => {
    const updateTimer = () => {
      const { timeLeft, days, hours, minutes, seconds } = calculateTimeLeft();
      setTimeLeft(timeLeft);
      setTimeComponents({ days, hours, minutes, seconds });
    };

    updateTimer(); // Call once immediately

    const countdown = setInterval(updateTimer, 1000);

    return () => clearInterval(countdown);
  }, [electionDate]);

  useEffect(() => {
    const fetchVoterCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user-count"
        );
        setVoterCount(response.data.count);
      } catch (error) {
        console.error("Error fetching voter count:", error);
      }
    };

    const fetchDistrictCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/districts/count"
        );
        setDistrictCount(response.data.count);
      } catch (error) {
        console.error("Error fetching district count:", error);
      }
    };
    const fetchVoteCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/voted-local-percentage"
        );
        console.log(response.data.percentage);
        setVotedLocalPercentage(response.data.percentage);
      } catch (error) {
        console.error("Error fetching district count:", error);
      }
    };
    const allCandidates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/candidates/details"
        );
        console.log(response.data.users.length);
        setCandidatesCount(response.data.users.length);
      } catch (error) {
        console.error("Error fetching district count:", error);
      }
    };
    fetchVoterCount();
    fetchDistrictCount();
    fetchVoteCount();
    allCandidates();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <>
          <div
            className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
            dir="rtl"
          >
            {/* Enhanced Parallax background with deeper blur effect */}
            <motion.div
              className="absolute inset-0"
              style={{ y: scrollY * 0.5 }}
            >
              <img
                src={img4}
                alt="الأردن"
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-transparent backdrop-blur-lg"></div>
            </motion.div>

            {/* Enhanced Interactive particles with size variation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-red-600"
                  style={{
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                  }}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    x: mousePosition.x + (Math.random() - 0.5) * 150,
                    y: mousePosition.y + (Math.random() - 0.5) * 150,
                  }}
                  transition={{ duration: 2 + Math.random() * 2 }}
                />
              ))}
            </div>

            {/* Enhanced Content */}
            <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
              {/* Centered Content */}
              <motion.div
                className="w-full lg:w-2/3 text-white mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.h2
                  className="text-sm uppercase tracking-widest text-red-600 font-semibold mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  شارك في مستقبل الأردن
                </motion.h2>
                <h1 className="text-5xl sm:text-7xl font-extrabold mt-2 mb-6 tracking-tight leading-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-600 to-white">
                    مرحبا, {voterName}
                  </span>
                </h1>
                <p className="mb-8 text-xl text-gray-300 max-w-lg mx-auto">
                  شارك في رسم مستقبل وطننا. صوتك أمانة وحق وواجب وطني. معاً نبني
                  أردناً أقوى وأكثر ازدهاراً.
                </p>
                <motion.div
                  className="flex justify-center items-center mb-8 p-4 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                >
                  <div className="text-red-600 text-5xl font-extrabold tracking-wider animate-pulse">
                    {timeLeft}
                  </div>
                </motion.div>
                <Link to="/votinglist">
                  <motion.button
                    className="bg-gradient-to-l from-green-600 to-red-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all mb-16 "
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0px 0px 10px rgba(255, 0, 0, 0.7)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    صوت الآن
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Enhanced Scroll indicator with glow effect */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 "
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center glow-sm">
                <motion.div
                  className="w-2 h-2 bg-white rounded-full mt-2"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
          <div className="relative flex flex-col md:flex-row justify-center items-center p-8 bg-gradient-to-r -mt-16 rounded-1xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-green-700 to-green-200 -z-10 opacity-75"></div>

            <motion.div
              className="md:w-1/2 mb-8 md:mb-0 flex flex-col items-center text-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeInOut" }}
            >
              <motion.h1
                className="text-5xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-black"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              >
                طريقة جديدة للمشاركة في الانتخابات
              </motion.h1>

              <motion.p
                className="mb-8 text-gray-900 text-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              >
                الدائرة الانتخابية: {district}
              </motion.p>
              <motion.div
                className="flex flex-wrap items-center gap-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
              >
                <Link to="/Electionresult">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 20px rgba(206, 17, 38, 0.7)",
                      border: "2px solid rgba(206, 17, 38, 0.7)",
                      backgroundColor: "rgba(206, 17, 38, 0.7)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#ce1126] via-[#007a3d] to-black text-white px-8 py-3 rounded-full transition-all duration-300"
                  >
                    سجل للمشاركة
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#007a3d",
                      color: "#ffffff",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-[#007a3d] text-[#007a3d] px-8 py-3 rounded-full transition-all duration-300"
                  >
                    المزيد من التفاصيل
                  </motion.button>
                </Link>
                <Link to="/nomination">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#000000",
                      color: "#ffffff",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-black text-black px-8 py-3 rounded-full transition-all duration-300"
                  >
                    طلب ترشيح قائمة محلية
                  </motion.button>
                </Link>
                <Link to="/PartyListNominationForm">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#ce1126",
                      color: "#ffffff",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-[#ce1126] text-[#ce1126] px-8 py-3 rounded-full transition-all duration-300"
                  >
                    طلب ترشيح القائمة الحزبية
                  </motion.button>
                </Link>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
                {[
                  {
                    value: `${voterCount !== null ? voterCount : "Loading..."}`,
                    label: "عدد الناخبين المسجلين",
                  },
                  {
                    value:
                      candidatesCount !== null ? candidatesCount : "Loading...",
                    label: "المرشحين",
                  },
                  {
                    value: `${
                      districtCount !== null ? districtCount : "Loading..."
                    }`,
                    label: "مناطق الانتخابات",
                  },
                  {
                    value: `${
                      votedLocalPercentage !== null
                        ? `${votedLocalPercentage.toFixed(2)}%` // Format to 2 decimal places
                        : "Loading..."
                    }`,
                    label: "نسبة الناخبين الذين صوتوا محلياً",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    custom={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={controls}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 * (index + 1),
                      ease: "easeOut",
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg"
                  >
                    <motion.div
                      className="text-4xl font-bold text-[#ce1126] mb-2"
                      whileHover={{ scale: 1.15, color: "#007a3d" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-900">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2 relative flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
              }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { bg: "bg-[#ce1126]", mt: "mt-12" },
                  { bg: "bg-[#007a3d]", mt: "mt-12" },
                  { bg: "bg-black", span: "col-span-2" },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className={`${card.bg} ${card.mt} ${card.span} rounded-2xl p-6 shadow-lg`}
                    whileHover={{
                      scale: 1.05,
                      rotate: 0,
                      boxShadow: "0 15px 20px rgba(0, 0, 0, 0.3)",
                      borderRadius: "1rem",
                      backgroundColor: "#f3f4f6",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={images[index]}
                      alt={`صورة ${index + 1}`}
                      className="rounded-full w-full h-auto"
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="absolute top-0 left-0 -z-10 w-full h-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.2 }}
              >
                <motion.div
                  className="absolute top-1/4 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-70 animate-pulse"
                  animate={{ scale: [1, 1.5, 1], rotate: 360 }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-purple-300 rounded-full opacity-70 animate-bounce"
                  animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                ></motion.div>
                <motion.div
                  className="absolute top-1/2 right-1/3 w-20 h-20 border-4 border-blue-300 rounded-full opacity-50"
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                ></motion.div>
              </motion.div>
            </motion.div>
          </div>
        </>
      ) : (
        <NotloggedHero />
      )}
    </>
  );
};

export default HeroSection;
