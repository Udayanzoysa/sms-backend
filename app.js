const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sms-app-portal.vercel.app"], // Replace with your React app's URLs
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api", tokenRoutes);
app.use("/api", userRoutes);

// Catch 404 Errors (Route Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    message: "The route you are trying to access does not exist.",
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error to the console

  res.status(err.status || 500).json({
    message: err.message || "An internal server error occurred.",
  });
});

module.exports = app;
