import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../services/api";

function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getSystemStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">Loading analytics...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📊 Platform Analytics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.totalUsers || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.totalCourses || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Total XP Generated</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats?.totalXP?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Active Today</h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats?.activeToday || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Students</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.totalStudents || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Lecturers</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats?.totalLecturers || 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAnalytics;
