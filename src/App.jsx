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
      <Route path="/progress" element={<StudentProgress />}></Route>
      <Route path="/quiz" element={<CreateQuiz />}></Route>
      <Route path="/upload" element={<UploadMaterials />}></Route>
      <Route path="/settings" element={<Settings />}></Route>
      <Route path="/gamification" element={<Gamification />}></Route>
      <Route path="/courses" element={<MyCourses />}></Route>
      <Route path="/welcomebasic" element={<WelcomeBasic />}></Route>
      <Route path="/recentactivity" element={<RecentActivity />}></Route>
      <Route path="/overallprogress" element={<OverallProgress />}></Route>
      <Route path="/mycoursesbasic" element={<MyCoursesBasic />}></Route>
      <Route path="/student/courses/:id" element={<CourseDetails />}></Route>
      <Route path="/protectedroute" element={<ProtectedRoute />}></Route>
      <Route
        path="/studentdashboardbasic"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboardBasic />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studentdashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studentcourses"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lecturerdashboard"
        element={
          <ProtectedRoute allowedRole="lecturer">
            <LecturerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/redirect" element={<RoleRedirect />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/lecturerprofile" element={<LecturerProfile />} />
      <Route path="/studentactivity" element={<StudentActivity />} />
      <Route path="/editstudentprofile" element={<EditStudentProfile />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/studentcourse" element={<StudentCourses />} />
    </Routes>
  );
}

export default App;
