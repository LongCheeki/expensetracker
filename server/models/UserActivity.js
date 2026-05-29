const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    username: {
      type: String,
      default: "Unknown",
    },
    action: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);