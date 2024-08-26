import React from "react";
import { useLocation, Link } from "react-router-dom";

const CheckEmail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nationalId = queryParams.get("national_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-white to-red-600 p-4">
      <div className="w-full max-w-md relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8">
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

        <h1 className="text-3xl font-bold mb-6 text-center text-black">
          تحقق من بريدك الإلكتروني
        </h1>
        <p className="text-center text-sm text-black mb-6">
          لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك
          الإلكتروني وإدخال الرمز لمواصلة.
        </p>
        <div className="text-center">
          <Link
            to={`/verify-otp?national_id=${nationalId}`}
            className="text-green-600 hover:underline font-semibold"
          >
            الانتقال إلى التحقق من OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
