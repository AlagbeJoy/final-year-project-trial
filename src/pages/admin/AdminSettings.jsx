import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminSettings() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ⚙️ System Settings
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-500">System settings coming soon...</p>
        </div>
      </main>
    </div>
  );
}

export default AdminSettings;
