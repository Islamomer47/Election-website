import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Adjust the import based on your file structure

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة.");
      return;
    }
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${baseURL}/auth/set-new-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      toast.success("تم تعيين كلمة المرور الجديدة بنجاح.");

      // Log in the user with the new access token, if provided
      const { accessToken } = response.data;
      if (accessToken) {
        login(accessToken);
        localStorage.setItem("accessToken", accessToken); // Update localStorage
      }

      // Navigate to the home page
      navigate(`/`);
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-2xl rounded-lg relative">
        {/* Floating shapes using Jordan flag colors */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>

        <div className="text-center mb-6">
          <img
            src="https://img.freepik.com/premium-vector/ballot-box-ballot-icon_928715-1379.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
            alt="Logo"
            className="w-24 h-auto mx-auto rounded-full border-4 border-white shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          تعيين كلمة مرور جديدة
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-black"
            >
              كلمة المرور الجديدة:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-12"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-black"
            >
              تأكيد كلمة المرور:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-12"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            تعيين كلمة المرور الجديدة
          </button>
        </form>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default SetNewPassword;
