import React from 'react'
import { useNavigate } from 'react-router-dom'

function CourseCard({title, progress, status}) {
    const navigate = useNavigate()

  return (
    <div 
    onClick={() => navigate('/student/course/1')}
    className='bg-white p-5 rounded-lg shadow cursor-pointer hover:shadow-md transition'>
        <h3 className='text-lg font-semibold text-gray-800mb-2'>
            {title}</h3>

        <p className='text-sm text-gray-500 mb-4'>
            Status: {status}</p>

        <div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
                <div className='bg-[#5a6499] h-3 rounded-full'
                style={{width: progress}}></div>
            </div>
            <p className='text-sm text-gray-500 mt-1'>
                {progress} completed
            </p>
        </div>
    </div>
  )
}

export default CourseCard