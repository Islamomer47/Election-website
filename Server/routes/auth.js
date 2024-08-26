const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Login route
router.post("/login", authController.login);

// Verify OTP route
router.post("/verify-otp", authController.verifyOTP);

//set new password
router.post("/set-new-password", authController.setNewPassword);

//Login with password
router.post("/login-with-password", authController.loginWithPassword);

//forggetting password
router.post(
  "/send-password-reset-email",
  authController.sendPasswordResetEmail
);
router.post("/reset-password", authController.resetPassword);

router.post("/resend-otp", authController.resendOTP);

module.exports = router;
