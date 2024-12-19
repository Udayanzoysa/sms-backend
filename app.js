const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const twoFactorRoutes = require("./routes/twoFactorRoutes");

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your React app's URL
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/2fa", twoFactorRoutes);

module.exports = app;
