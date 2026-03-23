const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, profile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (profile) user.profile = { ...user.profile, ...profile };

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete onboarding
router.post("/onboarding", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.onboarded = true;
    user.profile = { ...user.profile, ...req.body };

    await user.save();
    res.json({ message: "Onboarding completed", user });
  } catch (error) {
    console.error("Error updating onboarding:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user activities
router.get("/activities", auth, async (req, res) => {
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
