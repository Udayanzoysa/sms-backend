const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const tokenRoutes = require("./routes/tokenRoutes");

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your React app's URL
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

// Simple GET route that returns a message
app.get('/hi/world', (req, res) => {
  res.send('Hello, World! It\'s working!');
});

module.exports = app;
