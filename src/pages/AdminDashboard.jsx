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
  });
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const usersData = await api.getAllUsers();
      setUsers(usersData);

      const courses = await api.getCourses();
      const pending = courses.filter((c) => !c.published);
      setPendingCourses(pending);

      const today = new Date().toDateString();
      const activeToday = usersData.filter((u) =>
        u.activities?.some((a) => new Date(a.date).toDateString() === today),
      ).length;

      setStats({
        totalUsers: usersData.length,
        totalStudents: usersData.filter((u) => u.role === "student").length,
        totalLecturers: usersData.filter((u) => u.role === "lecturer").length,
        totalCourses: courses.length,
        totalCoursesPending: pending.length,
        activeToday,
        totalXP: usersData.reduce((sum, u) => sum + (u.xp || 0), 0),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (courseId) => {
    try {
      await api.updateCourse(courseId, { published: true });
      await fetchData();
      alert("✅ Course approved!");
    } catch (error) {
      alert("Failed to approve");
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (
      window.confirm(`Delete user ${userEmail}? This action cannot be undone.`)
    ) {
      try {
        await api.deleteUser(userId);
        await fetchData();
        alert("User deleted successfully");
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await api.register(newUser);
      alert("User added successfully!");
      setShowAddUser(false);
      setNewUser({ name: "", email: "", password: "", role: "student" });
      await fetchData();
    } catch (error) {
      alert("Failed to add user");
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      await fetchData();
      alert("Role updated successfully");
    } catch (error) {
      alert("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">Loading...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "overview"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "users"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "pending"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending ({stats.totalCoursesPending})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p>Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p>Students</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p>Lecturers</p>
              <p className="text-2xl font-bold">{stats.totalLecturers}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p>Courses</p>
              <p className="text-2xl font-bold">{stats.totalCourses}</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Management</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                + Add User
              </button>
            </div>

            {/* Add User Form */}
            {showAddUser && (
              <div className="bg-white p-4 rounded shadow mb-4">
                <h3 className="font-semibold mb-3">Add New User</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="border p-2 rounded"
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addUser}
                    className="bg-[#5a6499] text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">XP</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            changeUserRole(user._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="student">Student</option>
                          <option value="lecturer">Lecturer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">{user.xp || 0}</td>
                      <td className="px-4 py-3">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => deleteUser(user._id, user.email)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === "pending" && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-4">Pending Course Approvals</h2>
            {pendingCourses.length === 0 ? (
              <p className="text-gray-400">No pending courses</p>
            ) : (
              pendingCourses.map((course) => (
                <div
                  key={course._id}
                  className="border p-4 rounded mb-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{course.title}</p>
                    <p className="text-sm text-gray-500">
                      By: {course.instructor?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => approveCourse(course._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
