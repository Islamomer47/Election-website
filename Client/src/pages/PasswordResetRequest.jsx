import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${baseURL}/auth/send-password-reset-email`, { email });
      toast.success(
        "رابط إعادة تعيين كلمة المرور تم إرساله إلى بريدك الإلكتروني"
      );
    } catch (error) {
      toast.error("خطأ في إرسال رابط إعادة تعيين كلمة المرور");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
      <div className="w-full max-w-md relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8">
        {/* Floating shapes using Jordan flag colors */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-green-500 opacity-10 rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>

        <div className="text-center mb-6">
          <img
            src="https://img.freepik.com/premium-vector/ballot-box-ballot-icon_928715-1379.jpg?uid=R157407297&ga=GA1.1.336651591.1720684343&semt=ais_hybrid"
            alt="Logo"
            className="w-24 h-auto mx-auto rounded-full border-4 border-white shadow-lg transform hover:rotate-6 transition-transform duration-300"
          />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-black">
          نسيت كلمة المرور
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 opacity-90 sm:text-sm"
              required
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            إرسال رابط إعادة تعيين كلمة المرور
          </button>
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

export default PasswordResetRequest;
