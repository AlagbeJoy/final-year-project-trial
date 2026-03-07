// src/services/badgeService.js
import { badgeDefinitions } from "../data/badgeDefinitions";

class BadgeService {
  constructor() {
    this.badges = badgeDefinitions;
  }

  /**
   * Check which badges a user has earned
   */
  checkEarnedBadges(user) {
    if (!user) return [];

    return this.badges.filter((badge) => {
      try {
        return badge.condition(user);
      } catch (error) {
        console.error(`Error checking badge ${badge.id}:`, error);
        return false;
      }
    });
  }

  /**
   * Get user's earned badge IDs
   */
  getEarnedBadgeIds(user) {
    return (user?.badges || []).map((b) => b.id);
  }

  /**
   * Check for newly earned badges
   */
  checkNewBadges(user) {
    const earnedBadges = this.checkEarnedBadges(user);
    const currentBadgeIds = this.getEarnedBadgeIds(user);

    const newBadges = earnedBadges.filter(
      (badge) => !currentBadgeIds.includes(badge.id),
    );

    return newBadges;
  }

  /**
   * Award new badges to user
   */
  awardBadges(user, newBadges) {
    if (!user || newBadges.length === 0) return user;

    const updatedUser = {
      ...user,
      badges: [
        ...(user.badges || []),
        ...newBadges.map((b) => ({
          ...b,
          earnedAt: new Date().toISOString(),
        })),
      ],
    };

    // Add activities for each new badge
    newBadges.forEach((badge) => {
      updatedUser.activities = [
        {
          type: "achievement",
          message: `Earned badge: ${badge.name}`,
          xp: badge.xpReward,
          date: new Date().toISOString(),
          badgeId: badge.id,
        },
        ...(updatedUser.activities || []),
      ];

      // Add XP reward
      updatedUser.xp = (updatedUser.xp || 0) + badge.xpReward;
    });

    return updatedUser;
  }

  /**
   * Get badge progress for a user
   */
  getBadgeProgress(user, badge) {
    // This can be expanded for badges with progress tracking
    return {
      current: 0,
      target: 1,
      percentage: 0,
    };
  }

  /**
   * Get all badges with earned status
   */
  getAllBadgesWithStatus(user) {
    const earnedIds = this.getEarnedBadgeIds(user);

    return this.badges.map((badge) => ({
      ...badge,
      earned: earnedIds.includes(badge.id),
      earnedAt: user?.badges?.find((b) => b.id === badge.id)?.earnedAt,
    }));
  }

  /**
   * Get badges by category
   */
  getBadgesByCategory(user) {
    const badgesWithStatus = this.getAllBadgesWithStatus(user);

    return badgesWithStatus.reduce((acc, badge) => {
      const category = badge.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(badge);
      return acc;
    }, {});
  }
}

export default new BadgeService();
