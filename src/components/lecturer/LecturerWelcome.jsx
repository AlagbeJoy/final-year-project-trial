import React from "react";

function LecturerWelcome({ name }) {
  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">
        {greeting}, {name || "Lecturer"}! 👋
      </h1>
      <p className="opacity-90">
        Here's what's happening with your courses today.
      </p>
    </div>
  );
}

export default LecturerWelcome;
