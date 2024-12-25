const speakeasy = require("speakeasy");
const User = require("../models/user");
const { sendEmail } = require("../services/emailService");
const { generateOTP } = require("../utils/verify2FAToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const verifyTwoFactor = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if OTP is valid
    if (
      parseInt(user.twoFactorSecret) === parseInt(otp.trim()) &&
      new Date() < new Date(user.twoFactorSecretExpire)
    ) {
      const isProduction = process.env.NODE_ENV === "production";
      // Mark user as verified
      user.twoFactorSecret = null; // Clear OTP
      user.twoFactorSecretExpire = null;
      user.isVerified = true; // Or `isVerified = true`
      await user.save();

      // Generate JWT tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        path: "/",
        // secure: isProduction,
        // sameSite: isProduction ? "Strict" : "Lax",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        path: "/",
        // secure: isProduction,
        // sameSite: isProduction ? "Strict" : "Lax",
      });

      sendEmail(
        "unzoysa.un@gmail.com",
        "Hello from Zoho SMTP",
        "This is a test email!"
      );

      return res.status(200).json({
        message: "OTP verified successfully",
      });
    }

    res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    // Update user document with new OTP and expiration time
    user.twoFactorSecret = otp;
    user.twoFactorSecretExpire = otpExpire;
    await user.save();

    sendEmail(
      email,
      "Your OTP Code for SMS App",
      `Hi there,

      Thank you for using our SMS App!

      Here is your One-Time Password (OTP) to complete the login process: **${otp}**

      Please note: This code is valid for the next 15 minutes. Do not share it with anyone.

      If you didn’t request this, please contact our support team immediately.

      Best regards,
      The SMS App Team`
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

module.exports = { verifyTwoFactor, resendOtp };
