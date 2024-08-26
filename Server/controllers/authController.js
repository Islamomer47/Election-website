// Import necessary modules and dependencies
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
} = require("../utils/email");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Temporary storage for OTPs and reset tokens
let otpStore = {};
let resetTokensStore = {};
const OTP_EXPIRATION = 1 * 60 * 1000; // OTP expiration time set to 1 minute

// Login endpoint - sends an OTP to the user's email for authentication
exports.login = async (req, res) => {
  const { national_id } = req.body;

  try {
    const user = await User.findOne({ where: { national_id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP(); // Generate a new OTP
    const expiresAt = Date.now() + OTP_EXPIRATION; // Calculate expiration time
    otpStore[national_id] = { otp, expiresAt }; // Store the OTP and expiration time

    await sendOTPEmail(user.email, otp); // Send the OTP to the user's email

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP endpoint - verifies the OTP sent to the user's email
exports.verifyOTP = (req, res) => {
  const { national_id, otp } = req.body;

  try {
    const otpData = otpStore[national_id];
    if (!otpData) {
      return res.status(401).json({ message: "OTP not found" });
    }

    // Check if the OTP has expired
    if (Date.now() > otpData.expiresAt) {
      delete otpStore[national_id];
      return res.status(401).json({ message: "OTP has expired" });
    }

    // Validate the OTP
    if (otpData.otp !== parseInt(otp, 10)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    delete otpStore[national_id]; // OTP is used once

    // Generate a JWT token for the user
    const user = { national_id };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend OTP endpoint - resends the OTP to the user's email
exports.resendOTP = async (req, res) => {
  const { national_id } = req.body;

  if (!national_id)
    return res.status(400).json({ message: "No national ID found in session" });

  try {
    const user = await User.findOne({ where: { national_id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP(); // Generate a new OTP
    const expiresAt = Date.now() + OTP_EXPIRATION; // Calculate expiration time
    otpStore[national_id] = { otp, expiresAt }; // Store the OTP and expiration time

    await sendOTPEmail(user.email, otp); // Resend the OTP to the user's email

    res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Set new password endpoint - allows users to set a new password using a valid token
exports.setNewPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { national_id } = decoded;

    // Find the user by national ID
    const user = await User.findOne({ where: { national_id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Set and save the new password (password hashing will be handled by the `beforeSave` hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in setNewPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login with password endpoint - authenticates users using their national ID and password
exports.loginWithPassword = async (req, res) => {
  const { national_id, password } = req.body;

  try {
    // Find the user by national ID
    const user = await User.findOne({ where: { national_id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // If the password is correct, generate a JWT token
    const tokenPayload = { national_id: user.national_id };
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Return the access token to the client
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error in loginWithPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send password reset email endpoint - sends a password reset link to the user's email
exports.sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    resetTokensStore[user.national_id] = resetToken;

    // Create a reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user.national_id}`;

    // Send the password reset email
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset password endpoint - allows users to reset their password using a valid reset token
exports.resetPassword = async (req, res) => {
  const { national_id, token, newPassword } = req.body;

  try {
    const storedToken = resetTokensStore[national_id];
    if (!storedToken || storedToken !== token) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find the user by national ID
    const user = await User.findOne({ where: { national_id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Remove the token from the store after use
    delete resetTokensStore[national_id];

    // Generate a new JWT token for the user
    const tokenPayload = { national_id: user.national_id };
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(200)
      .json({ message: "Password reset successfully", accessToken });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
