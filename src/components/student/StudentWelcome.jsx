import React from "react";

function StudentWelcome({ user }) {
  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Get motivational quote based on time
  const getMotivationalMessage = () => {
    const messages = [
      "Ready to learn something new today?",
      "Every expert was once a beginner.",
      "Knowledge is power. Keep learning!",
      "Small progress is still progress.",
      "Your future is created by what you do today.",
      "Learning is a journey, enjoy the process!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Calculate level progress
  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = ((currentXP % 100) / 100) * 100;

  return (
    <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {greeting}, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="opacity-90 mb-4">{getMotivationalMessage()}</p>

          {/* Level Progress Bar */}
          <div className="max-w-md">
            <div className="flex justify-between text-sm mb-1">
              <span>Level {currentLevel}</span>
              <span>
                {currentXP} / {xpForNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2.5">
              <div
                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Avatar with level badge */}
        <div className="relative">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
            {user?.name?.charAt(0) || "👤"}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[#5a6499] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            {currentLevel}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentWelcome;
