import React from "react";

function StudentWelcome({ user }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const motivationalMessages = [
    "Ready to learn something new today?",
    "Keep up the great work!",
    "Every expert was once a beginner.",
    "Small progress is still progress.",
    "Your future is created by what you do today.",
  ];

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  return (
    <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {greeting}, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="opacity-90">{randomMessage}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          {user?.name?.charAt(0) || "👤"}
        </div>
      </div>
    </div>
  );
}

export default StudentWelcome;
