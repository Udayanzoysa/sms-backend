const speakeasy = require("speakeasy");
const User = require("../models/user");
const emailService = require("../services/emailService");
const { generateOTP } = require("../utils/verify2FAToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token missing" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user.id);
    res.json({ accessToken });
  });
};

module.exports = { refreshToken };
