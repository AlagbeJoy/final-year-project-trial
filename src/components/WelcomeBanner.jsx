import React from "react";
import { avatars } from "./AvatarSelector";

function WelcomeBanner({ user }) {
  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Get user's avatar
  const userAvatar =
    avatars.find((a) => a.id === user?.profile?.avatarId) || avatars[0];

  return (
    <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`${userAvatar.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg`}
        >
          {userAvatar.emoji}
        </div>

        {/* Welcome Text */}
        <div>
          <h1 className="text-2xl font-bold">
            {greeting}, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="opacity-90">
            {user?.profile?.bio || "Ready to learn something new today?"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
