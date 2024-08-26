import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginOTP = () => {
  const [nationalId, setNationalId] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNationalId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/auth/login`, {
        national_id: nationalId,
      });

      // Show success toast
      toast.success(response.data.message || "تم إرسال OTP بنجاح!");

      // Delay the navigation to allow the toast to be visible
      setTimeout(() => {
        navigate(`/check-email?national_id=${nationalId}`);
      }, 2000); // 2 seconds delay
    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
      <div className="w-full max-w-md relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8">
        {/* Floating shapes using Jordan flag colors */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>

        {/* Logo Section */}
        <div className="text-center mb-6">
          <img
            src="https://img.freepik.com/premium-vector/ballot-box-ballot-icon_928715-1379.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
            alt="Logo"
            className="w-24 h-auto mx-auto rounded-full border-4 border-white shadow-lg transform hover:rotate-6 transition-transform duration-300"
          />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          تسجيل الدخول باستخدام الرقم الوطني
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="national_id"
              className="block text-sm font-medium text-black"
            >
              رقم الهوية الوطنية:
            </label>
            <input
              type="text"
              id="national_id"
              value={nationalId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 opacity-90 sm:text-sm"
              placeholder="أدخل رقم الهوية الوطنية"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            إرسال OTP
          </button>

          {/* Link for Already Registered Users */}
          <div className="text-center mt-4">
            <Link
              to="/login-with-password"
              className="text-green-600 hover:underline font-semibold"
            >
              هل أنت مسجل بالفعل؟ تسجيل الدخول هنا
            </Link>
          </div>
        </form>

        {/* Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          className="mt-10"
        />
      </div>
    </div>
  );
};

export default LoginOTP;
