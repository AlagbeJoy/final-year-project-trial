import React from 'react'

function OverallProgress() {
  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>Overall Progres</h3>

      <div className='space-y-3'>
        <div>
            <p className='text-sm text-gray-600 mb-1'>Course Completion</p>
            <div className='w-full bg-gray-200 rounded-full h-3'>
                <div className='bg-[#5a6499] h-3 rounded-full w-[60%]'></div>
            </div>
            <p className='text-sm text-gray-500 mt-1'>60% completed</p>
        </div>
      </div>
    </div>
  );
}

export default OverallProgress