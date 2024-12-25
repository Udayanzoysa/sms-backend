const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateOTP } = require("../utils/verify2FAToken");
const { sendEmail } = require("../services/emailService");
const { loginOtpTemplate } = require("../services/emailTemplates");

const register = async (req, res) => {
  try {
    let { first_name, last_name, email, phone, password, confirm_password } =
      req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (phone.startsWith("0")) {
      phone = phone.slice(1);
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be 10 digits.",
      });
    }

    const formattedPhone = `+94${phone}`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const apiKey = require("crypto").randomBytes(20).toString("hex");

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = new User({
      first_name,
      last_name,
      email,
      phone: formattedPhone,
      password: hashedPassword,
      api_key: apiKey,
      twoFactorSecret: otp,
      twoFactorSecretExpire: otpExpire,
    });
    await newUser.save();
    res.status(201).json({
      message:
        "Registration successful. Please verify your email/phone using the OTP sent.",
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate OTP
  const otp = generateOTP();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

  user.twoFactorSecret = otp;
  user.twoFactorSecretExpire = otpExpire;
  user.isVerified = false;

  await sendEmail(user.email, "Login OTP Code", loginOtpTemplate(otp));
  await user.save();
  res.status(201).json({
    message:
      "Login successful. Please verify your email/phone using the OTP sent.",
    email: user.email,
  });
};

const verifyUser = async (req, res) => {
  const accessToken = req.cookies["accessToken"];
  try {
    if (!accessToken) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.role
      ? Array.isArray(user.role)
        ? user.role
        : [user.role]
      : [];

    return res.status(200).json({
      message: "User verified successfully",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        roles,
      },
    });
  } catch (error) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    const roles = []; // Fallback for guest response
    return res.status(401).json({
      message: "Invalid access token",
      user: {
        id: "Guest",
        first_name: null,
        last_name: null,
        name: null,
        email: null,
        roles,
      },
    });
  }
};

module.exports = { register, login, verifyUser };
