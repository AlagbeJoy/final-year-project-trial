import React from 'react'

function WelcomeBanner({user}) {
  const firstName = user?.name?.split(" ")[0]
  const hour =new Date().getHours()

  let greeting = "Welcome"
  if (hour < 12) greeting ="Good Morning"
  else if (hour < 18) greeting = "Good Afternoon"
  else greeting = "Good Evening"

  return (
    <div className="bg-linear-to-r from-indigo-300 to-purple-900 text-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold">
        {greeting}, {firstName} 👋
        <p className='text-sm opacity-90'>Department: {user.profile?.department}</p>
      </h1>
      <p className="opacity-90">
       Ready to continue your learning journey?
      </p>
    </div>
  );
}

export default WelcomeBanner