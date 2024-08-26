import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Adjust the import based on your file structure

const OTPBox = ({ index, value, onChange, inputRef }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d$/.test(value) || value === "") {
      onChange(index, value);
      if (value && index < 5) {
        // Move focus to the next box on the right after a delay
        setTimeout(() => {
          inputRef.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && value === "") {
      // Move focus to the previous box on the left after a delay
      setTimeout(() => {
        if (index > 0) inputRef.current[index - 1]?.focus();
      }, 0);
    }
  };

  return (
    <input
      type="text"
      maxLength="1"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      ref={(el) => (inputRef.current[index] = el)}
      className="w-12 h-12 border border-gray-300 rounded-md text-center text-2xl mx-1"
    />
  );
};

const VerifyOTP = () => {
  const [nationalId, setNationalId] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(30); // Initialize with 60 seconds
  const location = useLocation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { login } = useAuth(); // Get login function from AuthContext

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("national_id");
    if (id) {
      setNationalId(id);
    }
  }, [location.search]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear the interval when the component is unmounted or timeLeft changes
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/auth/verify-otp`, {
        national_id: nationalId,
        otp: otpCode,
      });
      const { accessToken } = response.data;

      // Store the token in localStorage
      localStorage.setItem("accessToken", accessToken);

      // Show success toast
      toast.success("تم التحقق بنجاح! تم تخزين رمز الوصول.");

      // Delay navigation to allow the toast to be visible
      setTimeout(() => {
        login(accessToken, () => {
          navigate(`/set-new-password`);
        });
      }, 2000); // 2 seconds delay
    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  const handleResendOTP = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/auth/resend-otp`, {
        national_id: nationalId,
      });
      toast.success(response.data.message || "تم إرسال OTP مرة أخرى!");

      // Optionally, you can reset OTP input fields or handle UI updates
      setOtp(Array(6).fill(""));
      setTimeLeft(60); // Reset the timer after resending OTP
    } catch (error) {
      toast.error(
        error.response?.data?.message || "حدث خطأ في إعادة إرسال OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
      <div className="w-full max-w-md relative">
        {/* Floating shapes using Jordan flag colors */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>

        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="p-8">
            <div className="text-center mb-8">
              <img
                src="https://img.freepik.com/premium-vector/ballot-box-ballot-icon_928715-1379.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
                alt="Logo"
                className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg transform hover:rotate-6 transition-transform duration-300"
              />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center text-black">
              تحقق من OTP
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="national_id"
                  className="block text-sm font-medium text-black mb-1"
                >
                  رقم الهوية الوطنية:
                </label>
                <input
                  type="text"
                  id="national_id"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="block w-full px-4 py-3 bg-white bg-opacity-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="أدخل رقم الهوية الوطنية"
                  required
                />
              </div>

              <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                {otp.map((value, index) => (
                  <OTPBox
                    key={index}
                    index={index}
                    value={value}
                    onChange={handleOtpChange}
                    inputRef={inputRefs}
                    className="w-12 h-12 text-center text-xl bg-white bg-opacity-50 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
              >
                تحقق من OTP
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={handleResendOTP}
                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 transform ${
                  timeLeft > 0
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800"
                }`}
                disabled={timeLeft > 0} // Disable button while timer is running
              >
                {timeLeft > 0
                  ? `يمكنك إعادة إرسال OTP بعد ${timeLeft} ثانية`
                  : "إعادة إرسال رمز OTP"}
              </button>
            </div>

            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
