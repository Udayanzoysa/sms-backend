const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

// Connect to the database
connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
