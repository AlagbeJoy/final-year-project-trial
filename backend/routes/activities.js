const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Add activity
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { type, message, xp } = req.body;

    if (!user.activities) user.activities = [];
    user.activities.unshift({
      type,
      message,
      xp: xp || 0,
      date: new Date(),
    });

    await user.save();

    res.json({ message: "Activity added", activity: user.activities[0] });
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get activities
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.activities || []);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
