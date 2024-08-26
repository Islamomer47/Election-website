import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Adjust the import based on your file structure

const PasswordReset = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const national_id = params.get("id");

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/auth/reset-password`, {
        national_id,
        token,
        newPassword,
      });
      // Extract and store the access token in local storage
      const accessToken = response.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      login(accessToken); // Update context with the new access token
      toast.success("تم إعادة تعيين كلمة المرور بنجاح");
      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 2000);
    } catch (error) {
      toast.error("حدث خطأ أثناء إعادة تعيين كلمة المرور");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
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
            <h2 className="text-3xl font-bold mb-6 text-center text-black">
              إعادة تعيين كلمة المرور
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-black mb-1 group-focus-within:text-green-700 transition-colors duration-200"
                >
                  كلمة المرور الجديدة:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full px-4 py-3 bg-white bg-opacity-50 border border-transparent rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
              >
                إعادة تعيين كلمة المرور
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="block text-black hover:text-green-700 transition-colors duration-200 hover:underline"
              >
                العودة إلى تسجيل الدخول
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

export default PasswordReset;
