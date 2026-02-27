import React from 'react'
import StudentSidebar from '../components/StudentSidebar'
import ModuleList from '../components/ModuleList';

function CourseDetails() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 px-6 py-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-semibold text-gray-800">
            Web Development
          </h1>
          <p className="text-gray-500 mt-1 ">
            Leran the fundamentals of building websites and web applications.
          </p>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Course Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-[#5a6499] h-3 rounded-full w-[60%]"></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">60% completed</p>
          </div>
        </div>

        <ModuleList/>
      </main>
    </div>
  );
}

export default CourseDetails