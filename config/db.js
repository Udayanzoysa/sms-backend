const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Remove `useNewUrlParser` and `useUnifiedTopology`
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
