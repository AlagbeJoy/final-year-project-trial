import React from 'react'
import { useAuth } from '../context/AuthContext'
import StudentSidebar from '../components/StudentSidebar';

function StudentActivity() {
    const {currentUser} = useAuth();

    if (!currentUser) return <div>Loading....</div>

    const activities = currentUser.activities || [];

  return (
    <div className='flex min-h-screen bg-gray-50'>
        <StudentSidebar/>

        <main className='flex-1 p-8'>
            <h2 className='text-2xl font-bold mb-6 text-[#5a6499]'>Activity Feed</h2>

            {activities.length === 0 ? (
                <p>No activity yet</p>
            ) : (
                <div className='space-y-3'>
                    {activities.map((a,i) => (
                    <div key={i} className='bg-white p-4 rounded shadow'>
                        <p className='font-medium'>{a.message}</p>
                        <p className='text-sm text-gray-400'>+{a.xp} XP . {new Date(a.date).toLocaleString()}</p>
                    </div>
                    ))}
                    </div>
            )}
        </main>
    </div>
  )
}

export default StudentActivity