import React from "react";

function MyCoursesBasic() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Courses</h3>

      <ul className="space-y-3">
        <li className="border p-3 rounded-md">
          <p className="font-medium">Web Development</p>
          <p className="text-sm text-gray-500">4 modules completed</p>
        </li>

        <li className="border p-3 rounded-md">
          <p className="font-medium">Data Structure</p>
          <p className="text-sm text-gray-500">2 modules completed</p>
        </li>
      </ul>
    </div>
  );
}

export default MyCoursesBasic;
