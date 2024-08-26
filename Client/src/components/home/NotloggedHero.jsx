import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NotloggedHero = () => {
  const [animate, setAnimate] = useState(false);
  const { isAuthenticated } = useAuth(); // Access the authentication status
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate("/electoral-districts"); // Navigate to electoral districts page if logged in
    } else {
      navigate("/login-with-password"); // Navigate to login page if not logged in
    }
  };

  return (
    <>
      <div
        className="relative min-h-screen flex items-center -mt-1 justify-center p-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/jordan-flag-wrinkled-dark-background-3d-render_1379-595.jpg?ga=GA1.1.493505850.1715763129&semt=ais_hybrid')",
        }}
      >
        {/* Overlay with opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-700 to-green-500 opacity-75"></div>

        {/* Content */}
        <div className="relative z-10 text-white max-w-6xl w-full mx-auto text-right">
          <h1
            className={`text-6xl md:text-7xl font-extrabold mb-6 tracking-wider transform ${
              animate
                ? "translate-y-0 opacity-100"
                : "-translate-y-12 opacity-0"
            } transition-all duration-1000 ease-out`}
          >
            أهلاً بك في موقع الانتخابات
          </h1>

          <p
            className={`mb-8 text-base md:text-lg max-w-2xl transform ${
              animate
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            } transition-all duration-1000 delay-300 ease-out`}
          >
            شارك في الانتخابات وصوت لصالح المرشحين الذين يؤمنون بمستقبل أفضل.
            تعرّف على الدوائر الانتخابية والمزيد من المعلومات حول العملية
            الانتخابية.
          </p>

          <button
            onClick={handleButtonClick}
            className="bg-white text-green-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg"
          >
            استكشاف الدوائر الانتخابية
          </button>
        </div>
      </div>
    </>
  );
};

export default NotloggedHero;
