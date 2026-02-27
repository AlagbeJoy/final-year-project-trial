import React from 'react'

function LeaderboardPreview({demo, starterLeaderboard = []}) {

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const realLeaderboard = users
  .filter(u => u.role === "student")
  .sort ((a,b) => (b.xp || 0) - (a.xp || 0))
  .slice(0,5);

  const data = demo ? starterLeaderboard : realLeaderboard;

  // const sortedLeaderboard = realLeaderboard
  //   .filter(u => u.role === "student")
  //   .sort((a,b) => (b.xp || 0) - (a.xp || 0))
  //   .slice(0,5);

  //   const LeaderboardToShow = demo ? starterLeaderboard : sortedLeaderboard;

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h3 className='font-semibold mb-3'>Leaderboard</h3>

      {data.length === 0 ? (
        <p className='text-gray-400'>No leaderboard yet</p>
      ) : (
        data.map ((item, index) => (
          <div key={index} className='flex justify-between border-b py-2'>
            <span>{item.name || item.title}</span>
            <span>{item.xp}</span>
          </div>
        ))
      )}
    </div>
  )
}

export default LeaderboardPreview