const crypto = require("crypto");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const isOTPValid = (otp, expiresAt) => {
  return new Date() < new Date(expiresAt) && otp !== null;
};

module.exports = { generateOTP, isOTPValid };
