import React from 'react'

function ActivityFeed({activities}) {
    if (!Array.isArray(activities) || activities.length === 0){
        return (
            <div className='bg-white p-4 rounded shadow'>
                <h3 className='font-semibold mb-2'>Recent Activities</h3>
                <p className='text-sm text-gray-400'>No activities yet</p>
            </div>
        );
    }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Recent Activities</h3>

      {activities.map((a, i) => (
        <div key={i} className='border-b py-2 text-sm text-gray-600'>
          <p>{a.message}</p>
          <span className='text-xs text-gray-400'>+{a.xp} XP . {new Date(a.date).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed