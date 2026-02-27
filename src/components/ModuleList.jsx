import React from 'react'

function ModuleList() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Course Modules
      </h2>

      <ul className="space-y-4">
        <li className="border p-4 rounded-md">
          <p className="font-medium">Module 1: Introduction to HTML</p>
          <p className="text-sm text-gray-500">📄 Notes • ▶ Video</p>
        </li>

        <li className="border p-4 rounded-md">
          <p className="font-medium">Module 2: CSS Basics </p>
          <p className="text-sm text-gray-500">📄 Slides • ▶ Video</p>
        </li>

        <li className="border p-4 rounded-md">
          <p className="font-medium">Module 3: Javascript Fundamentals</p>
          <p className="text-sm text-gray-500">
            📄 Notes • ▶ Video • 📝 Assignment
          </p>
        </li>
      </ul>
    </div>
  );
}

export default ModuleList