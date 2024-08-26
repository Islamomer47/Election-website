import React, { useState } from "react";
import axios from "axios";
import backgroundImage from "../assets/img/4.jpeg";
import jordanFlag from "../assets/img/1.png";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${baseURL}/api/contact`,
        {
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponseMessage(response.data.message);
      setErrorMessage("");

      // Reset form fields
      setFormData({ message: "" });
    } catch (error) {
      setErrorMessage("Failed to send the message. Please try again later.");
      setResponseMessage("");
    }
  };

  return (
    <div
      className="min-h-screen py-6 flex flex-col justify-center sm:py-12 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#007A3D] to-[#CE1126] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="text-white relative px-4 py-10 bg-[#F9F9F9] bg-opacity-90 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="text-center pb-6">
            <img
              src={jordanFlag}
              alt="Jordan Flag"
              className="mx-auto w-16 mb-4"
            />
            <h1 className="text-4xl font-bold text-[#CE1126]">تواصل معنا</h1>
            <p className="text-[#000000]">الرجاء إدخال رسالتك هنا</p>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              className="shadow mb-4 min-h-0 appearance-none border border-[#CE1126] rounded-lg h-64 w-full py-2 px-3 text-[#000000] leading-tight focus:outline-none focus:shadow-outline"
              placeholder="ادخل النص هنا.."
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={{ height: "121px" }}
            ></textarea>

            <div className="flex justify-center">
              <input
                className="shadow bg-[#007A3D] hover:bg-[#CE1126] text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
                value="أرسل"
              />
            </div>
          </form>

          {/* Display response or error messages */}
          {responseMessage && (
            <p className="text-green-500 mt-4">{responseMessage}</p>
          )}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          <div className="text-center mt-6">
            <a
              href="https://veilmail.io/e/FkKh7o"
              className="font-medium text-[#CE1126] hover:underline"
            >
              أو انقر هنا لإرسال بريد إلكتروني
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;