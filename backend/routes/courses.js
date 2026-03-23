const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get all courses
router.get("/", auth, async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single course
router.get("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("📚 Course found:", course.title);
    console.log("📚 Units count:", course.units?.length || 0);

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new course (lecturer only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res
        .status(403)
        .json({ message: "Only lecturers can create courses" });
    }

    console.log("📦 Creating new course...");
    console.log("📦 Units received:", req.body.units?.length || 0);

    // Prepare course data - keep both units and modules for compatibility
    const courseData = {
      ...req.body,
      instructor: req.user.id,
      published: false,
      createdAt: new Date(),
    };

    // Ensure units are also stored in modules for compatibility
    if (req.body.units && req.body.units.length > 0) {
      courseData.modules = req.body.units;
    }

    const course = new Course(courseData);
    await course.save();

    console.log("✅ Course created successfully with ID:", course._id);
    console.log("✅ Units saved:", course.units?.length || 0);

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update course (admin or course owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log("📝 Updating course:", courseId);
    console.log("📝 Update data received - units:", req.body.units?.length || 0);

    const course = await Course.findById(courseId);

    if (!course) {
      console.log("❌ Course not found:", courseId);
      return res.status(404).json({ message: "Course not found" });
    }

    // Convert both to strings for proper comparison
    const courseInstructorId = course.instructor?.toString();
    const userId = req.user.id?.toString();
    
    console.log("📚 Course instructor ID (string):", courseInstructorId);
    console.log("📚 Current user ID (string):", userId);

    const isOwner = courseInstructorId === userId;
    const isAdmin = req.user.role === "admin";

    console.log("🔍 isOwner:", isOwner);
    console.log("🔍 isAdmin:", isAdmin);

    if (!isOwner && !isAdmin) {
      console.log("❌ Permission denied");
      return res
        .status(403)
        .json({ message: "You don't have permission to update this course" });
    }

    console.log("✅ Permission granted. Updating course...");

    // REMOVE the instructor field from update data to avoid casting error
    // Also remove any other fields that shouldn't be updated directly
    const { instructor, instructorId, ...safeUpdateData } = req.body;
    
    // Prepare update data
    const updateData = {
      ...safeUpdateData,
      lastUpdated: new Date()
    };
    
    // If units are provided, also update modules for compatibility
    if (updateData.units && updateData.units.length > 0) {
      updateData.modules = updateData.units;
    }

    console.log("📦 Update data (without instructor):", Object.keys(updateData));

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("✅ Course updated successfully:", updatedCourse.title);
    console.log("✅ Units in updated course:", updatedCourse.units?.length || 0);

    res.json(updatedCourse);
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Delete course (admin only or course owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isOwner = course.instructor?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Enroll in a course (student only)
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can enroll in courses" });
    }

    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.published) {
      return res.status(403).json({ message: "Course is not yet published" });
    }

    if (course.students.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    course.students.push(userId);
    await course.save();

    const user = await User.findById(userId);

    const alreadyEnrolled = user.profile?.enrolledCourses?.some(
      (c) => c.courseId && c.courseId.toString() === courseId,
    );

    if (!alreadyEnrolled) {
      if (!user.profile) user.profile = {};
      if (!user.profile.enrolledCourses) user.profile.enrolledCourses = [];

      user.profile.enrolledCourses.push({
        courseId: course._id,
        title: course.title,
        progress: 0,
        completedLessons: [],
        completedQuizzes: [],
        enrolledAt: new Date(),
      });

      user.xp = (user.xp || 0) + 50;

      if (!user.activities) user.activities = [];
      user.activities.push({
        type: "enrollment",
        message: `Enrolled in ${course.title}`,
        xp: 50,
        date: new Date(),
      });

      await user.save();
    }

    res.json({
      message: "Successfully enrolled in course",
      course: { id: course._id, title: course.title },
      xpEarned: 50,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete a unit (simplified for units structure)
router.post("/:id/units/:unitId/complete", auth, async (req, res) => {
  try {
    const { id: courseId, unitId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enrolledCourse = user.profile?.enrolledCourses?.find(
      (c) => c.courseId && c.courseId.toString() === courseId,
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ message: "Course not found in your profile" });
    }

    if (enrolledCourse.completedLessons?.includes(unitId)) {
      return res.json({ message: "Unit already completed", xpEarned: 0 });
    }

    if (!enrolledCourse.completedLessons) {
      enrolledCourse.completedLessons = [];
    }
    enrolledCourse.completedLessons.push(unitId);

    const course = await Course.findById(courseId);
    if (course && course.units) {
      const totalUnits = course.units.length;
      enrolledCourse.progress = Math.round(
        (enrolledCourse.completedLessons.length / totalUnits) * 100,
      );
    }

    const xpEarned = 40; // XP for completing a unit
    user.xp = (user.xp || 0) + xpEarned;

    user.activities.push({
      type: "unit",
      message: "Completed a unit",
      xp: xpEarned,
      date: new Date(),
    });

    await user.save();

    res.json({
      message: "Unit completed",
      xpEarned,
      progress: enrolledCourse.progress,
    });
  } catch (error) {
    console.error("Error completing unit:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit quiz
router.post("/:id/units/:unitId/quiz", auth, async (req, res) => {
  try {
    const { id: courseId, unitId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const unit = course.units?.find((u) => u._id?.toString() === unitId);
    if (!unit || !unit.quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let correct = 0;
    unit.quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / unit.quiz.questions.length) * 100);
    const passed = score >= 70;

    if (passed) {
      const user = await User.findById(userId);
      if (user) {
        const enrolledCourse = user.profile?.enrolledCourses?.find(
          (c) => c.courseId && c.courseId.toString() === courseId,
        );

        if (enrolledCourse) {
          if (!enrolledCourse.completedQuizzes) {
            enrolledCourse.completedQuizzes = [];
          }
          if (!enrolledCourse.completedQuizzes.includes(unitId)) {
            enrolledCourse.completedQuizzes.push(unitId);
          }

          const xpEarned = 40;
          user.xp = (user.xp || 0) + xpEarned;

          user.activities.push({
            type: "quiz",
            message: `Passed quiz with ${score}%`,
            xp: xpEarned,
            date: new Date(),
          });

          await user.save();
        }
      }
    }

    res.json({
      score,
      passed,
      correct,
      total: unit.quiz.questions.length,
      message: passed ? "Quiz passed!" : "Quiz failed. Try again.",
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
