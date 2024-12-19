const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateOTP } = require("../utils/verify2FAToken");

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

    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Remove the leading '0' from the phone number if it exists
    if (phone.startsWith("0")) {
      phone = phone.slice(1);
    }

    // Validate phone number (9 digits after removing the leading 0)
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be 10 digits.",
      });
    }

    // Prepend the country code (e.g., +94 for Sri Lanka)
    const formattedPhone = `+94${phone}`;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique API key
    const apiKey = require("crypto").randomBytes(20).toString("hex");

    // Generate OTP
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    // Create a new user
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

module.exports = register;

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
  await user.save();
  res.status(201).json({
    message:
      "Login successful. Please verify your email/phone using the OTP sent.",
    email: user.email,
  });
};

module.exports = { register, login };
