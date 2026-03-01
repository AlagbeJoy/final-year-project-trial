import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import Loginpage from "./pages/Loginpage";
import CreateAccountpage from "./pages/CreateAccountpage";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentOnboarding from "./pages/StudentOnboarding";
import LecturerOnboarding from "./pages/LecturerOnboarding";
import NavBar from "./components/NavBar";
import WelcomeBanner from "./components/WelcomeBanner";
import ProgressCard from "./components/ProgressCard";
import DailyChallenge from "./components/DailyChallenge";
import ContinueLearning from "./components/ContinueLearning";
import BadgesGrid from "./components/BadgesGrid";
import LeaderboardPreview from "./components/LeaderboardPreview";
import StudentProgress from "./pages/StudentProgress";
import CreateQuiz from "./pages/CreateQuiz";
import UploadMaterials from "./pages/UploadMaterials";
import Settings from "./pages/Settings";
import Gamification from "./pages/Gamification";
import MyCourses from "./pages/MyCourses";
import StudentDashboardBasic from "./pages/StudentDashboardBasic";
import WelcomeBasic from "./components/WelcomeBasic";
import RecentActivity from "./components/RecentActivity";
import OverallProgress from "./components/OverallProgress";
import MyCoursesBasic from "./components/MyCoursesBasic";
import StudentCourses from "./pages/StudentCourses";
import CourseDetails from "./pages/CourseDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./pages/RoleRedirect";
import AuthRoute from "./components/AuthRoute";
import OnboardingRoute from "./components/OnboardingRoute";
import StudentProfile from "./pages/StudentProfile";
import LecturerProfile from "./pages/LecturerProfile";
import StudentActivity from "./pages/StudentActivity";
import EditStudentProfile from "./components/EditStudentProfile";
import ForgotPassword from "./components/ForgotPassword";
import LecturerCreateCourse from "./pages/LecturerCreateCourse";
import LecturerCourses from "./pages/LecturerCourses";
import LecturerAnalytics from "./pages/LecturerAnalytics";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />}></Route>
      <Route path="/header" element={<Header />}></Route>
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Loginpage />
          </AuthRoute>
        }
      ></Route>
      <Route
        path="/createaccount"
        element={
          <AuthRoute>
            <CreateAccountpage />
          </AuthRoute>
        }
      ></Route>
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      <Route
        path="/studentonboarding"
        element={
          <OnboardingRoute role="student">
            <StudentOnboarding />
          </OnboardingRoute>
        }
      ></Route>
      <Route
        path="/lectureronboarding"
        element={
          <OnboardingRoute role="lecturer">
            <LecturerOnboarding />
          </OnboardingRoute>
        }
      ></Route>
      <Route path="/dashboardnavbar" element={<NavBar />}></Route>
      <Route path="/welcome" element={<WelcomeBanner />}></Route>
      <Route path="/progresscard" element={<ProgressCard />}></Route>
      <Route path="/dailychallenge" element={<DailyChallenge />}></Route>
      <Route path="/continuelearning" element={<ContinueLearning />}></Route>
      <Route path="/badgeesgrid" element={<BadgesGrid />}></Route>
      <Route
        path="/leaderboardpreview"
        element={<LeaderboardPreview />}
      ></Route>
      <Route path="/courses" element={<MyCourses />}></Route>
      <Route path="/welcomebasic" element={<WelcomeBasic />}></Route>
      <Route path="/recentactivity" element={<RecentActivity />}></Route>
      <Route path="/overallprogress" element={<OverallProgress />}></Route>
      <Route path="/mycoursesbasic" element={<MyCoursesBasic />}></Route>
      <Route path="/student/courses/:id" element={<CourseDetails />}></Route>
      <Route path="/protectedroute" element={<ProtectedRoute />}></Route>

      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route
          path="/studentdashboardbasic"
          element={<StudentDashboardBasic />}
        />
        <Route path="/studentcourses" element={<StudentCourses />} />
        <Route path="/studentactivity" element={<StudentActivity />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/editstudentprofile" element={<EditStudentProfile />} />
        <Route path="/progress" element={<StudentProgress />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="lecturer" />}>
        <Route path="/lecturerdashboard" element={<LecturerDashboard />} />
        <Route
          path="/lecturer/create-course"
          element={<LecturerCreateCourse />}
        />
        <Route path="/lecturer/courses" element={<LecturerCourses />} />
        <Route path="/lecturer/analytics" element={<LecturerAnalytics />} />
        <Route path="/lecturer/profile" element={<LecturerProfile />} />
        <Route path="/createquiz" element={<CreateQuiz />} />
        <Route path="/upload" element={<UploadMaterials />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/settings" element={<Settings />} />
        <Route path="/gamification" element={<Gamification />} />
      </Route>

      <Route path="/redirect" element={<RoleRedirect />} />
      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute allowedRole="student">
            <CourseDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
