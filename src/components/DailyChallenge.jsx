import React from 'react'

function DailyChallenge() {
  return (
    <div className='bg-white p-6 rounded-lg shadow-sm'>
        <h3 className='font-semibold mb-2'>Daily Challenge</h3>
        <p className='text-gray-600 text-sm'>Complete 1 lesson today</p>

        <button className='mt-4 bg-[#5a6499] text-white px-4 py-2 rounded'>Start Now (+20  XP)</button>
    </div>
  )
}

export default DailyChallenge