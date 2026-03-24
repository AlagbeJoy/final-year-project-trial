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

    // Recalculate level based on XP
    user.level = Math.floor(user.xp / 100) + 1;
    
    await user.save();
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: user.level,
      profile: user.profile
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete onboarding with XP
router.post("/onboarding", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get XP from request (default 30)
    const xpEarned = req.body.xpEarned || 30;
    
    // Update user
    user.onboarded = true;
    user.profile = { ...user.profile, ...req.body.onboardingData };
    user.xp = (user.xp || 0) + xpEarned;
    user.level = Math.floor(user.xp / 100) + 1;
    
    // Add activity
    if (!user.activities) user.activities = [];
    user.activities.unshift({
      type: "onboarding",
      message: "Completed profile setup",
      xp: xpEarned,
      date: new Date()
    });
    
    await user.save();
    
    // Return updated user
    res.json({ 
      message: "Onboarding completed", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        onboarded: user.onboarded,
        profile: user.profile,
        activities: user.activities
      }
    });
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
