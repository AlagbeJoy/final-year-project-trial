import React from 'react'

function ProgressCard({xp}) {
  const currentXP = xp || 0
  const level = Math.floor(currentXP / 100)
  const progress = currentXP % 100

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className='font-bold text-lg mb-2'>Your Progress</h2>

      <p className=' text-3xl font-bold text-indigo-600'>
        Level {level}</p>

        <div className='w-full bg-gray-200 h-3 rounded-full mt-4'>
          <div className='bg-indigo-600 h-3 rounded-full' style={{width: `${progress}%`}}></div>
        </div>

        <p className='text-sm text-gray-500 mt-2'>{progress}/100 XP to next level</p>
    </div>
  );
}

export default ProgressCard