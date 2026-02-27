import React from 'react'

function NavBar() {
  return (
    <nav className='flex items-center justify-between px-6 py-4 bg-white shadow-sm'>
      <h1 className="font-bold text-lg text-[#5a6499]">Logo</h1>

      <div className="flex items-center gap-6">
        <span className="text-sm font-medium">Courses</span>
        <span className="text-sm font-medium">Leaderboard</span>
        <span className="text-sm font-medium">Profile</span>
        <span className="text-sm font-medium">Points</span>
        <span className="text-sm font-medium">Level</span>
        <div className="w-8 h-8 bg-[#5a6499] rounded-full text-white flex items-center justify-center ">U</div>
      </div>
    </nav>
  );
}

export default NavBar