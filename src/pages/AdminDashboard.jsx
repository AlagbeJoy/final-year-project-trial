import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    activeToday: 0,
    totalXP: 0,
  });

  useEffect(() => {
    // Load system stats
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const courses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );

    const today = new Date().toDateString();
    const activeToday = users.filter((u) =>
      u.activities?.some((a) => new Date(a.date).toDateString() === today),
    ).length;

    setStats({
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.role === "student").length,
      totalLecturers: users.filter((u) => u.role === "lecturer").length,
      totalCourses: courses.length,
      activeToday,
      totalXP: users.reduce((sum, u) => sum + (u.xp || 0), 0),
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
            title="Active Today"
            value={stats.activeToday}
            icon="🔥"
            color="bg-orange-500"
          />
          <StatCard
            title="Total XP"
            value={stats.totalXP}
            icon="⭐"
            color="bg-indigo-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserManagement />
          <SystemHealth />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
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

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">👥 User Management</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.email}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : user.role === "lecturer"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">⚙️ System Health</h2>
      <div className="space-y-4">
        <HealthItem label="API Status" value="Healthy" status="good" />
        <HealthItem label="Database" value="Connected" status="good" />
        <HealthItem label="Storage" value="72% Used" status="warning" />
        <HealthItem label="Last Backup" value="2 hours ago" status="good" />
        <HealthItem label="Active Sessions" value="24" status="good" />
      </div>
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
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>
        {value}
      </span>
    </div>
  );
}

export default AdminDashboard;
