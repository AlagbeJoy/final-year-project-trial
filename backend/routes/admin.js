const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all users (admin only)
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get system stats (admin only)
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalLecturers = await User.countDocuments({ role: "lecturer" });
    const totalCourses = await Course.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await User.countDocuments({
      "activities.date": { $gte: today },
    });

    const totalXPResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$xp" } } },
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalLecturers,
      totalCourses,
      activeToday,
      totalXP: totalXPResult[0]?.total || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role (admin only)
router.put("/users/:id/role", auth, admin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ message: "Cannot delete the only admin account" });
      }
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete course (admin only)
router.delete("/courses/:id", auth, admin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
