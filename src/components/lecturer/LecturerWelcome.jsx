import React from 'react'

function LecturerWelcome({user}) {
    const firstName = user?.name?.split(" ")[0]

  return (
    <div className='bg-linear-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow'>
      <h1 className='text-2xl font-bold'>Welcome back, Lecturer {firstName} 👨‍🏫</h1>

      <p className='opacity-90'>Here's your academic overview for today.</p>
    </div>
  );
}

export default LecturerWelcome