import React from 'react'
import { useNavigate } from 'react-router-dom';

function ContinueLearning({courses}) {
  const navigate = useNavigate();

  if (!courses?.length) return null;
  //   {
  //   return (
  //     <div className='bg-white p-6 rounded shadow text-center'>
  //       <p className='text-gray-500'>No courses yet</p>
  //       <button
  //       onClick={() =>navigate("/studentcourse")}
  //       className='mt-3 bg-[#5a4699] text-white px-4 py-2 rounded'>
  //         Browse Courses
  //       </button>
  //     </div>
  //   )
  // }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-4">Continue Learning</h3>

      <div className="flex gap-4 overflow-x-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            className="min-w-62.5 bg-white p-4 rounded shadow cursor-pointer hover:scale-105 transition"
            onClick={() =>
              navigate(`/lesson/${course.id}/${course.lastLesson || 0}`)
            }
          >
            <p className="font-semi-bold">{course.title}</p>
            <p className="text-sm text-gray-500">
              {course.progress || 0}% done
            </p>

            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-[#5a4699] h-2 rounded"
                style={{ width: `${course.progress || 0}%` }}
              />
              </div>
            </div>
        ))}       
      </div> 
      </div>    
  );
}

export default ContinueLearning