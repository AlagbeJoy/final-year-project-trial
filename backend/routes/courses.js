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
    console.log("📚 Modules count:", course.modules?.length || 0);
    if (course.modules && course.modules.length > 0) {
      course.modules.forEach((module, i) => {
        console.log(`  Module ${i + 1}: ${module.title}`);
        console.log(`  Lessons: ${module.lessons?.length || 0}`);
      });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new course (lecturer only)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is lecturer
    if (req.user.role !== "lecturer") {
      return res
        .status(403)
        .json({ message: "Only lecturers can create courses" });
    }

    console.log("📦 Creating new course...");
    console.log("📦 Modules received:", req.body.modules?.length || 0);
    console.log("📦 Units received:", req.body.units?.length || 0);
    console.log("📦 Full body:", JSON.stringify(req.body, null, 2));

    const courseData = {
      ...req.body,
      instructor: req.user.id,
    };

    // If units are provided but modules aren't, use units as modules
    if (
      req.body.units &&
      (!req.body.modules || req.body.modules.length === 0)
    ) {
      courseData.modules = req.body.units;
      console.log("📦 Using units as modules:", courseData.modules.length);
    }

    const course = new Course(courseData);
    await course.save();

    console.log("✅ Course created successfully with ID:", course._id);
    console.log("✅ Modules saved:", course.modules?.length || 0);

    res.status(201).json(course);
  } catch (error) {
    console.error("❌ ERROR DETAILS:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Send more detailed error to client
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      name: error.name 
    });
  }
});

-(
  // Enroll in a course (student only)
  router.post("/:id/enroll", auth, async (req, res) => {
    try {
      console.log("📝 ENROLLMENT ATTEMPT");
      console.log("👤 User from token:", req.user);
      console.log("👤 User role:", req.user.role);
      console.log("📚 Course ID:", req.params.id);

      // Check if user is student
      if (req.user.role !== "student") {
        console.log("❌ Not a student! Role is:", req.user.role);
        return res
          .status(403)
          .json({ message: "Only students can enroll in courses" });
      }

      console.log("✅ User is a student, proceeding with enrollment...");

      const courseId = req.params.id;
      const userId = req.user.id;

      // Find course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check if already enrolled
      if (course.students.includes(userId)) {
        return res
          .status(400)
          .json({ message: "Already enrolled in this course" });
      }

      // Add student to course
      course.students.push(userId);
      await course.save();

      // Add course to user's enrolled courses
      const user = await User.findById(userId);

      // Check if already in user's enrolled courses
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

        // Award XP for enrolling
        user.xp = (user.xp || 0) + 50;

        // Add activity
        if (!user.activities) user.activities = [];
        user.activities.push({
          type: "enrollment",
          message: `Enrolled in ${course.title}`,
          xp: 50,
          date: new Date(),
        });

        await user.save();
      }

      console.log("✅ Enrollment successful for user:", userId);
      res.json({
        message: "Successfully enrolled in course",
        course: {
          id: course._id,
          title: course.title,
        },
        xpEarned: 50,
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

// Update course progress (complete lesson)
router.post(
  "/:id/modules/:moduleId/lessons/:lessonId/complete",
  auth,
  async (req, res) => {
    try {
      const { id: courseId, moduleId, lessonId } = req.params;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find the enrolled course
      const enrolledCourse = user.profile?.enrolledCourses?.find(
        (c) => c.courseId && c.courseId.toString() === courseId,
      );

      if (!enrolledCourse) {
        return res
          .status(404)
          .json({ message: "Course not found in your profile" });
      }

      // Check if lesson already completed
      if (enrolledCourse.completedLessons.includes(lessonId)) {
        return res.json({ message: "Lesson already completed", xpEarned: 0 });
      }

      // Add to completed lessons
      enrolledCourse.completedLessons.push(lessonId);

      // Update progress
      const course = await Course.findById(courseId);
      if (course) {
        const totalLessons = course.modules.reduce(
          (sum, m) => sum + (m.lessons?.length || 0),
          0,
        );
        enrolledCourse.progress = Math.round(
          (enrolledCourse.completedLessons.length / totalLessons) * 100,
        );
      }

      // Award XP
      const xpEarned = 10;
      user.xp = (user.xp || 0) + xpEarned;

      // Add activity
      user.activities.push({
        type: "lesson",
        message: "Completed a lesson",
        xp: xpEarned,
        date: new Date(),
      });

      await user.save();

      res.json({
        message: "Lesson completed",
        xpEarned,
        progress: enrolledCourse.progress,
      });
    } catch (error) {
      console.error("Error completing lesson:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
