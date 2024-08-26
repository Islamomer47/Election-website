import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/LoginWithPass.css";
import { useAuth } from "../context/AuthContext";

const LoginWithPass = () => {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nationalId") setNationalId(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/auth/login-with-password`, {
        national_id: nationalId,
        password,
      });

      // Handle successful login
      const { accessToken } = response.data;
      toast.success("تم تسجيل الدخول بنجاح!");

      login(accessToken);

      // Delay navigation to allow the toast to be seen
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل تسجيل الدخول");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
      <div className="w-full max-w-md relative">
        {/* Floating shapes using Jordan flag colors */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>

        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
          <div className="p-8">
            <div className="text-center mb-8">
              <img
                src="https://img.freepik.com/premium-vector/ballot-box-ballot-icon_928715-1379.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
                alt="Logo"
                className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg transform hover:rotate-6 transition-transform duration-300"
              />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center text-black">
              تسجيل الدخول
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label
                  htmlFor="national_id"
                  className="block text-sm font-medium text-black mb-1 group-focus-within:text-green-700 transition-colors duration-200"
                >
                  الرقم الوطني:
                </label>
                <input
                  type="text"
                  id="national_id"
                  name="nationalId"
                  value={nationalId}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-white bg-opacity-50 border border-transparent rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="أدخل الرقم الوطني"
                />
              </div>

              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black mb-1 group-focus-within:text-green-700 transition-colors duration-200"
                >
                  كلمة المرور:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-white bg-opacity-50 border border-transparent rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="أدخل كلمة المرور"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
              >
                تسجيل الدخول
              </button>
            </form>

            <div className="text-center mt-6 space-y-3">
              <Link
                to="/login-otp"
                className="block text-black hover:text-green-700 transition-colors duration-200 hover:underline"
              >
                انشأ ملف تعريفي جديد
              </Link>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black border-opacity-30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-black">أو</span>
                </div>
              </div>

              <Link
                to="/request-password-reset"
                className="block text-black hover:text-green-700 transition-colors duration-200 hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default LoginWithPass;
