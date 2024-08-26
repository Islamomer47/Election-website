const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return crypto.randomInt(100000, 999999);
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "JO_ELECTION <islamomarhafith@gmail.com>",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

// Define and export the new function for sending password reset email
const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: "JO_ELECTION <islamomarhafith@gmail.com>",
    to: email,
    subject: "Password Reset Request",
    text: `Please use the following link to reset your password: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

module.exports = { generateOTP, sendOTPEmail, sendPasswordResetEmail };
