const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Onboarding route with auth
router.post("/onboarding", auth, async (req, res) => {
  try {
    const { onboardingData, xpEarned } = req.body;

    // Get user ID from auth token
    // For now, we'll use email from the decoded token
    // You should have proper JWT verification
    const userEmail = req.user?.email || req.body.email;

    console.log("📝 Updating onboarding for:", userEmail);

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
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Onboarding completed for:", user.email);

    res.json({
      message: "Onboarding completed",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboarded: user.onboarded,
        xp: user.xp,
        level: user.level,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("❌ Onboarding error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
