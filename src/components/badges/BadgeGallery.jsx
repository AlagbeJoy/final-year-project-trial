import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import badgeService from "../../services/badgeService";
import BadgeCard from "./BadgeCard";
import { badgeCategories } from "../../data/badgeDefinitions";

function BadgeGallery() {
  const { currentUser } = useAuth();
  const [badgesByCategory, setBadgesByCategory] = useState({});
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    earned: 0,
    totalXP: 0,
  });

  useEffect(() => {
    if (currentUser) {
      const categorized = badgeService.getBadgesByCategory(currentUser);
      setBadgesByCategory(categorized);

      const earned = badgeService.checkEarnedBadges(currentUser);
      const totalXP = earned.reduce((sum, b) => sum + b.xpReward, 0);

      setStats({
        total: badgeService.badges.length,
        earned: earned.length,
        totalXP,
      });
    }
  }, [currentUser]);

  return (
    <div className="space-y-8">
      {/* Badge Stats */}
      <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">🏆 Your Badge Collection</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{stats.earned}</p>
            <p className="text-sm opacity-90">Badges Earned</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm opacity-90">Total Badges</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.totalXP}</p>
            <p className="text-sm opacity-90">Bonus XP</p>
          </div>
        </div>
      </div>

      {/* Badges by Category */}
      {Object.entries(badgesByCategory).map(([category, badges]) => {
        const categoryInfo =
          badgeCategories[category] || badgeCategories.achievement;
        const earnedCount = badges.filter((b) => b.earned).length;

        return (
          <div key={category} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{categoryInfo.name}</h3>
              <span className="text-sm text-gray-500">
                {earnedCount}/{badges.length} earned
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {badges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={badge.earned}
                  earnedAt={badge.earnedAt}
                  onClick={() => setSelectedBadge(badge)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div
                className={`text-6xl mb-4 ${badgeCategories[selectedBadge.category]?.color.split(" ")[0]} p-4 rounded-full inline-block`}
              >
                {selectedBadge.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{selectedBadge.name}</h3>
              <p className="text-gray-600">{selectedBadge.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">
                  {badgeCategories[selectedBadge.category]?.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">XP Reward</span>
                <span className="font-medium text-green-600">
                  +{selectedBadge.xpReward} XP
                </span>
              </div>
              {selectedBadge.earned && selectedBadge.earnedAt && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Earned On</span>
                  <span className="font-medium">
                    {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {selectedBadge.hidden && !selectedBadge.earned && (
                <div className="bg-purple-100 text-purple-700 p-3 rounded-lg text-center">
                  🔮 This is a secret badge. Keep learning to discover how to
                  earn it!
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBadge(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              {selectedBadge.earned && (
                <button
                  onClick={() => {
                    // Share badge
                    alert("Share feature coming soon!");
                  }}
                  className="flex-1 bg-[#5a6499] text-white py-2 rounded-lg hover:bg-[#4a5499] transition"
                >
                  Share
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BadgeGallery;
