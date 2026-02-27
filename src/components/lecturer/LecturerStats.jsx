import React from 'react'

function LecturerStats() {
    const stats = [
      { title: "Total Students", value: 120 },
      { title: "Courses Created", value: 5 },
      { title: "Assignments", value: 18 },
      { title: "XP Awarded", value: 2400 },
    ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
            <div key={index}
            className='bg-white p-6 rounded-2xl shadow'>
                <h3 className='text-gray-500 text-sm'>{stat.title}</h3>
                <p className='text-2xl font-bold mt-2'>{stat.value}</p>
            </div>
        ))}
    </div>
  )
}

export default LecturerStats