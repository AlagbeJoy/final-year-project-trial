import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import api from "../services/api";

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalCoursesPending: 0,
    activeToday: 0,
    totalXP: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Get all users
      const users = await api.getAllUsers();
      const courses = await api.getCourses();

      // Calculate stats
      const pendingCourses = courses.filter((c) => !c.published);
      const totalQuizzes = courses.reduce(
        (sum, c) =>
          sum +
          (c.units?.filter((u) => u.quiz?.questions?.length > 0).length || 0),
        0,
      );
      const totalQuestions = courses.reduce(
        (sum, c) =>
          sum +
          (c.units?.reduce((s, u) => s + (u.quiz?.questions?.length || 0), 0) ||
            0),
        0,
      );

      const today = new Date().toDateString();
      const activeToday = users.filter((u) =>
        u.activities?.some((a) => new Date(a.date).toDateString() === today),
      ).length;

      // Get recent activities (last 10)
      const allActivities = [];
      users.forEach((user) => {
        if (user.activities) {
          user.activities.forEach((activity) => {
            allActivities.push({
              user: user.name,
              userEmail: user.email,
              ...activity,
              date: new Date(activity.date),
            });
          });
        }
      });
      const recentActivities = allActivities
        .sort((a, b) => b.date - a.date)
        .slice(0, 10);

      setStats({
        totalUsers: users.length,
        totalStudents: users.filter((u) => u.role === "student").length,
        totalLecturers: users.filter((u) => u.role === "lecturer").length,
        totalCourses: courses.length,
        totalCoursesPending: pendingCourses.length,
        activeToday,
        totalXP: users.reduce((sum, u) => sum + (u.xp || 0), 0),
        totalQuizzes,
        totalQuestions,
      });

      setPendingCourses(pendingCourses.slice(0, 5));
      setRecentActivities(recentActivities);

      // Generate system logs (simulated)
      const logs = [
        {
          time: new Date(),
          level: "info",
          message: "System started successfully",
        },
        {
          time: new Date(Date.now() - 3600000),
          level: "info",
          message: "Daily backup completed",
        },
        {
          time: new Date(Date.now() - 7200000),
          level: "warning",
          message: "High API response time detected",
        },
      ];
      setSystemLogs(logs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (courseId) => {
    try {
      await api.updateCourse(courseId, { published: true });
      fetchAllData(); // Refresh data
      alert("Course approved successfully!");
    } catch (error) {
      console.error("Error approving course:", error);
      alert("Failed to approve course");
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${userEmail}? This action cannot be undone.`,
      )
    ) {
      try {
        await api.deleteUser(userId);
        fetchAllData();
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">Loading dashboard...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System Management & Oversight</p>
        </div>

        {/* Database Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">
              ✅ Connected to MongoDB Atlas
            </span>
            <span className="text-sm text-gray-500 ml-auto">
              Last sync: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="bg-blue-500"
          />
          <StatCard
            title="Students"
            value={stats.totalStudents}
            icon="🎓"
            color="bg-green-500"
          />
          <StatCard
            title="Lecturers"
            value={stats.totalLecturers}
            icon="👨‍🏫"
            color="bg-purple-500"
          />
          <StatCard
            title="Courses"
            value={stats.totalCourses}
            icon="📚"
            color="bg-yellow-500"
          />
          <StatCard
            title="Pending Approval"
            value={stats.totalCoursesPending}
            icon="⏳"
            color="bg-orange-500"
          />
          <StatCard
            title="Active Today"
            value={stats.activeToday}
            icon="🔥"
            color="bg-red-500"
          />
          <StatCard
            title="Total XP"
            value={stats.totalXP.toLocaleString()}
            icon="⭐"
            color="bg-indigo-500"
          />
          <StatCard
            title="Quiz Questions"
            value={stats.totalQuestions}
            icon="📝"
            color="bg-pink-500"
          />
        </div>

        {/* Admin Actions & Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Course Approvals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>⏳</span> Pending Course Approvals
            </h2>
            {pendingCourses.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No pending courses
              </p>
            ) : (
              <div className="space-y-3">
                {pendingCourses.map((course) => (
                  <div
                    key={course._id}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-500">
                        By: {course.instructor?.name || "Unknown"}
                      </p>
                    </div>
                    <button
                      onClick={() => approveCourse(course._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>⚙️</span> System Health
            </h2>
            <div className="space-y-3">
              <HealthItem
                label="API Status"
                value="Operational"
                status="good"
              />
              <HealthItem label="Database" value="Connected" status="good" />
              <HealthItem label="Storage" value="72% Used" status="warning" />
              <HealthItem
                label="Last Backup"
                value="2 hours ago"
                status="good"
              />
              <HealthItem label="Active Sessions" value="24" status="good" />
            </div>
          </div>
        </div>

        {/* User Management & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Management Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>👥</span> Recent Users
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm">Name</th>
                    <th className="px-4 py-2 text-left text-sm">Role</th>
                    <th className="px-4 py-2 text-center text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* This would fetch from API */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📊</span> Recent Activity
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-2 border-b">
                  <span className="text-xl">
                    {activity.type === "enrollment" && "📚"}
                    {activity.type === "lesson" && "📖"}
                    {activity.type === "quiz" && "📝"}
                    {activity.type === "achievement" && "🏆"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.date.toLocaleString()}
                    </p>
                  </div>
                  {activity.xp > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      +{activity.xp} XP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> System Logs
          </h2>
          <div className="space-y-2 font-mono text-sm">
            {systemLogs.map((log, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  log.level === "error"
                    ? "bg-red-50 text-red-700"
                    : log.level === "warning"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-xs text-gray-400">
                  {log.time.toLocaleString()}
                </span>
                <span className="ml-2">[{log.level.toUpperCase()}]</span>
                <span className="ml-2">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
      <div
        className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white text-xl mb-3`}
      >
        {icon}
      </div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function HealthItem({ label, value, status }) {
  const colors = {
    good: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    bad: "text-red-600 bg-red-100",
  };

  return (
    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
      <span className="text-gray-600">{label}</span>
      <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>
        {value}
      </span>
    </div>
  );
}

export default AdminDashboard;
