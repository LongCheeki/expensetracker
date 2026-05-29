const UserActivity = require("../models/UserActivity");

const createActivity = async (user, action, detail = "") => {
  try {
    await UserActivity.create({
      user: user?._id || null,
      username: user?.username || "Unknown",
      action,
      detail,
    });
  } catch (error) {
    console.error("Failed to create activity:", error.message);
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await UserActivity.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activities." });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
};