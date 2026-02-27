import React from 'react'
import { Link } from 'react-router-dom'

function EmptyStateCard({title, description, buttonText, to}) {
  return (
    <div className='bg-white rounded-xl p-6 shadow text-center border'>
        <h3 className='font-semibold text-lg mb-2'>{title}</h3>
        <p className='text-gray-500 mb-4'>{description}</p>

        {to && (
            <Link 
            to={to}
            className='bg-[#5a6499] text-white px-4 py-3 rounded-md'>
            {buttonText}
            </Link>
        )

        }
    </div>
  )
}

export default EmptyStateCard