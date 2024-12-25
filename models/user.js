const mongoose = require("mongoose");
const crypto = require("crypto");

// Create a Schema for the User model
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirm_password: {
    type: String,
  },
  api_key: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended", "Pending"],
    default: "Pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  sms_credits: {
    type: Number,
    default: 10,
  },
  billing_info: {
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zip_code: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    payment_method: {
      type: String,
      enum: ["Credit Card", "PayPal", "Bank"],
      default: "Bank",
    },
  },
  group_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: [],
    },
  ],
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  isTwoFactorEnabled: {
    type: Boolean,
  },
  twoFactorSecret: {
    type: String,
  },
  twoFactorSecretExpire: { type: Date },
  isVerified: {
    type: Boolean,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
