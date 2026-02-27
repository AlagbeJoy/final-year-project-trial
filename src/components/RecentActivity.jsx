import React from 'react'

function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>

      <ul className="space-y-3 text-sm">
        <li className="text-gray-600">Completed "HTML Basics" lesson</li>
        <li className="text-gray-600">Downloaded "CSS Notes"</li>
        <li className="text-gray-600">Started "Javascript Introduction"</li>
      </ul>
    </div>
  );
}

export default RecentActivity