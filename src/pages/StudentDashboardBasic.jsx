import React from "react";
import WelcomeBasic from "../components/WelcomeBasic";
import MyCoursesBasic from "../components/MyCoursesBasic";
import OverallProgress from "../components/OverallProgress";
import RecentActivity from "../components/RecentActivity";
import StudentSidebar from "../components/StudentSidebar";

function StudentDashboardBasic() {
  return (
   
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 px-6 py-6 space-y-6">
        <WelcomeBasic />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MyCoursesBasic />
          <OverallProgress />
        </div>

        <RecentActivity />
      </main>
    </div>
  );
}

export default StudentDashboardBasic;
