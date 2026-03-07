import React, { useState, useEffect } from "react";
import { badgeCategories } from "../../data/badgeDefinitions";

function BadgeNotification({ badge, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const category =
    badgeCategories[badge.category] || badgeCategories.achievement;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-xl shadow-2xl p-4 max-w-sm border-l-4 border-yellow-400">
        <div className="flex items-start gap-3">
          {/* Badge Icon */}
          <div
            className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}
          >
            {badge.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-800">🏆 New Badge Earned!</h4>
            <p className="text-lg font-semibold text-[#5a6499]">{badge.name}</p>
            <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                +{badge.xpReward} XP
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-yellow-400 h-1 rounded-full animate-progress"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default BadgeNotification;
