import React from 'react'

function LecturerRecentActivity() {
    const activities =[
        "New student enrolled in Web Dev 101",
        "Assignment 3 submitted by 200 students",
        "Leaderboard updated",
    ];

  return (
    <div className='bg-whitep-6 rounded-2xl shadow'>
        <h2 className='text-lg font-bold mb-4'>Recent Activity</h2>

        <ul className='space-y-2'>
            {activities.map((activity,index) => (
                <li className='text-gray-600 border-b pb-2' key={index}>{activity}</li>
            ))}
        </ul>
    </div>
  )
}

export default LecturerRecentActivity