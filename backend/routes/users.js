const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Onboarding route
router.post("/onboarding", async (req, res) => {
  try {
    const { onboardingData, xpEarned } = req.body;

    // Get user from auth token (you'll need auth middleware)
    // For now, let's assume we have the user email from the request
    const userEmail = req.body.email || "test@example.com"; // You'll need to get this from token

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          onboarded: true,
          profile: onboardingData,
          xp: xpEarned || 30,
        },
        $push: {
          activities: {
            type: "onboarding",
            message: "Completed profile onboarding",
            xp: 20,
            date: new Date(),
          },
        },
      },
      { new: true, upsert: false },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Onboarding completed",
      user,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const userEmail = req.query.email || "test@example.com";
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
