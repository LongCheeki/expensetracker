const express = require("express");
const router = express.Router();

const { getAllActivities } = require("../controllers/activityController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getAllActivities);

module.exports = router;