import React from "react";
import { badgeCategories } from "../../data/badgeDefinitions";

function BadgeCard({ badge, earned, earnedAt, onClick }) {
  const category =
    badgeCategories[badge.category] || badgeCategories.achievement;

  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
        earned ? "opacity-100" : "opacity-50 grayscale"
      }`}
    >
      <div
        className={`${category.color} rounded-xl p-4 shadow-lg hover:shadow-xl transition`}
      >
        {/* Badge Icon */}
        <div className="text-4xl mb-2 text-center">{badge.icon}</div>

        {/* Badge Name */}
        <h3 className="font-bold text-sm text-center mb-1">{badge.name}</h3>

        {/* Badge Description */}
        <p className="text-xs text-center opacity-75">{badge.description}</p>

        {/* XP Reward */}
        <div className="mt-2 text-center">
          <span className="inline-block bg-white bg-opacity-50 rounded-full px-2 py-1 text-xs font-semibold">
            +{badge.xpReward} XP
          </span>
        </div>

        {/* Earned Date Tooltip */}
        {earned && earnedAt && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            ✓
          </div>
        )}
      </div>

      {/* Hover Info */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition"></div>
    </div>
  );
}

export default BadgeCard;
