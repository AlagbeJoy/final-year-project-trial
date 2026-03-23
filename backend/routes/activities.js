const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Add an activity
router.post("/", auth, async (req, res) => {
  try {
    const { type, message, xp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.activities) {
      user.activities = [];
    }

    user.activities.push({
      type,
      message,
      xp: xp || 0,
      date: new Date(),
    });

    await user.save();

    res.json({
      message: "Activity added",
      activity: user.activities[user.activities.length - 1],
    });
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user activities
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.activities || []);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
