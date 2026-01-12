// Achievement system for Minecraft 3D Color-by-Number Game

/**
 * Achievement types:
 * - completion: Complete X models
 * - perfection: Complete models with no mistakes
 * - speed: Complete models under par time
 * - collection: Unlock items/packs
 * - currency: Earn total coins/diamonds
 * - streak: Complete multiple perfect models in a row
 * - special: Rare events (jackpot, etc.)
 */

export const ACHIEVEMENTS = [
  // Completion Achievements
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first model",
    icon: "🎨",
    category: "completion",
    criteria: { type: "modelsCompleted", count: 1 },
    reward: { coins: 10 }
  },
  {
    id: "novice_painter",
    name: "Novice Painter",
    description: "Complete 5 models",
    icon: "🖌️",
    category: "completion",
    criteria: { type: "modelsCompleted", count: 5 },
    reward: { coins: 25 }
  },
  {
    id: "skilled_artist",
    name: "Skilled Artist",
    description: "Complete 10 models",
    icon: "🎨",
    category: "completion",
    criteria: { type: "modelsCompleted", count: 10 },
    reward: { diamonds: 1 }
  },
  {
    id: "master_painter",
    name: "Master Painter",
    description: "Complete 25 models",
    icon: "🏆",
    category: "completion",
    criteria: { type: "modelsCompleted", count: 25 },
    reward: { diamonds: 3 }
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete all available models",
    icon: "⭐",
    category: "completion",
    criteria: { type: "allModelsCompleted" },
    reward: { diamonds: 5, coins: 100 }
  },

  // Pack Completion Achievements
  {
    id: "starter_complete",
    name: "Starter Champion",
    description: "Complete all Starter Pack models",
    icon: "🌟",
    category: "completion",
    criteria: { type: "packCompleted", packId: "starter" },
    reward: { coins: 20 }
  },
  {
    id: "tool_master",
    name: "Tool Master",
    description: "Complete all Tool Pack models",
    icon: "⚒️",
    category: "completion",
    criteria: { type: "packCompleted", packId: "tools" },
    reward: { diamonds: 1 }
  },
  {
    id: "weapon_expert",
    name: "Weapon Expert",
    description: "Complete all Weapon Pack models",
    icon: "⚔️",
    category: "completion",
    criteria: { type: "packCompleted", packId: "weapons" },
    reward: { diamonds: 1 }
  },
  {
    id: "animal_lover",
    name: "Animal Lover",
    description: "Complete all Animal Pack models",
    icon: "🐰",
    category: "completion",
    criteria: { type: "packCompleted", packId: "animals" },
    reward: { diamonds: 1 }
  },
  {
    id: "armored_up",
    name: "Armored Up",
    description: "Complete all Armor Pack models",
    icon: "🛡️",
    category: "completion",
    criteria: { type: "packCompleted", packId: "armor" },
    reward: { diamonds: 1 }
  },

  // Perfection Achievements
  {
    id: "flawless_first",
    name: "Flawless First",
    description: "Complete a model with zero mistakes",
    icon: "✨",
    category: "perfection",
    criteria: { type: "perfectCompletion", count: 1 },
    reward: { coins: 15 }
  },
  {
    id: "perfect_ten",
    name: "Perfect Ten",
    description: "Complete 10 models with zero mistakes",
    icon: "💎",
    category: "perfection",
    criteria: { type: "perfectCompletion", count: 10 },
    reward: { diamonds: 2 }
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Complete 25 models with zero mistakes",
    icon: "🌟",
    category: "perfection",
    criteria: { type: "perfectCompletion", count: 25 },
    reward: { diamonds: 5 }
  },

  // Speed Achievements
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete 5 models under par time",
    icon: "⚡",
    category: "speed",
    criteria: { type: "speedBonus", count: 5 },
    reward: { coins: 30 }
  },
  {
    id: "lightning_fast",
    name: "Lightning Fast",
    description: "Complete 15 models under par time",
    icon: "⚡",
    category: "speed",
    criteria: { type: "speedBonus", count: 15 },
    reward: { diamonds: 2 }
  },
  {
    id: "sonic_painter",
    name: "Sonic Painter",
    description: "Complete a model in under half the par time",
    icon: "💨",
    category: "speed",
    criteria: { type: "speedHalfPar", count: 1 },
    reward: { diamonds: 3 }
  },

  // Collection Achievements
  {
    id: "brush_collector",
    name: "Brush Collector",
    description: "Unlock all basic brushes",
    icon: "🖌️",
    category: "collection",
    criteria: { type: "brushesUnlocked", brushes: ["basic", "multiFill", "area", "xray"] },
    reward: { coins: 50 }
  },
  {
    id: "fancy_brushes",
    name: "Fancy Brushes",
    description: "Unlock all cosmetic brushes",
    icon: "✨",
    category: "collection",
    criteria: { type: "brushesUnlocked", brushes: ["golden", "rainbow"] },
    reward: { diamonds: 1 }
  },
  {
    id: "pack_hunter",
    name: "Pack Hunter",
    description: "Unlock all model packs",
    icon: "📦",
    category: "collection",
    criteria: { type: "allPacksUnlocked" },
    reward: { diamonds: 5, coins: 100 }
  },

  // Currency Achievements
  {
    id: "penny_saver",
    name: "Penny Saver",
    description: "Earn 500 total coins",
    icon: "💰",
    category: "currency",
    criteria: { type: "totalCoinsEarned", count: 500 },
    reward: { coins: 25 }
  },
  {
    id: "coin_collector",
    name: "Coin Collector",
    description: "Earn 2000 total coins",
    icon: "💰",
    category: "currency",
    criteria: { type: "totalCoinsEarned", count: 2000 },
    reward: { diamonds: 2 }
  },
  {
    id: "diamond_miner",
    name: "Diamond Miner",
    description: "Earn 25 total diamonds",
    icon: "💎",
    category: "currency",
    criteria: { type: "totalDiamondsEarned", count: 25 },
    reward: { diamonds: 3 }
  },
  {
    id: "fortune_500",
    name: "Fortune 500",
    description: "Have 500 coins at once",
    icon: "💰",
    category: "currency",
    criteria: { type: "coinsAtOnce", count: 500 },
    reward: { diamonds: 1 }
  },

  // Streak Achievements
  {
    id: "three_perfect",
    name: "Triple Perfect",
    description: "Complete 3 perfect models in a row",
    icon: "🔥",
    category: "streak",
    criteria: { type: "perfectStreak", count: 3 },
    reward: { coins: 40 }
  },
  {
    id: "five_perfect",
    name: "Unstoppable",
    description: "Complete 5 perfect models in a row",
    icon: "🔥",
    category: "streak",
    criteria: { type: "perfectStreak", count: 5 },
    reward: { diamonds: 2 }
  },
  {
    id: "ten_perfect",
    name: "Legendary",
    description: "Complete 10 perfect models in a row",
    icon: "🏆",
    category: "streak",
    criteria: { type: "perfectStreak", count: 10 },
    reward: { diamonds: 5, coins: 100 }
  },

  // Special Achievements
  {
    id: "jackpot",
    name: "Jackpot!",
    description: "Win the jackpot reward",
    icon: "💰",
    category: "special",
    criteria: { type: "jackpotWon", count: 1 },
    reward: { coins: 50 }
  },
  {
    id: "lucky_three",
    name: "Triple Jackpot",
    description: "Win the jackpot 3 times",
    icon: "🎰",
    category: "special",
    criteria: { type: "jackpotWon", count: 3 },
    reward: { diamonds: 5 }
  },
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    category: "special",
    criteria: { type: "levelReached", level: 5 },
    reward: { coins: 30 }
  },
  {
    id: "level_10",
    name: "Master Crafter",
    description: "Reach level 10",
    icon: "🌟",
    category: "special",
    criteria: { type: "levelReached", level: 10 },
    reward: { diamonds: 3, coins: 100 }
  },
  {
    id: "first_diamond",
    name: "Shiny!",
    description: "Earn your first diamond",
    icon: "💎",
    category: "special",
    criteria: { type: "firstDiamond" },
    reward: { coins: 20 }
  },
  {
    id: "no_mistakes_easy",
    name: "Careful Beginner",
    description: "Complete an easy model with zero mistakes",
    icon: "🎯",
    category: "special",
    criteria: { type: "perfectDifficulty", difficulty: "easy" },
    reward: { coins: 10 }
  },
  {
    id: "no_mistakes_medium",
    name: "Precision Player",
    description: "Complete a medium model with zero mistakes",
    icon: "🎯",
    category: "special",
    criteria: { type: "perfectDifficulty", difficulty: "medium" },
    reward: { coins: 20 }
  },
  {
    id: "no_mistakes_hard",
    name: "Flawless Master",
    description: "Complete a hard model with zero mistakes",
    icon: "🎯",
    category: "special",
    criteria: { type: "perfectDifficulty", difficulty: "hard" },
    reward: { diamonds: 2 }
  }
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get all achievement categories
 */
export function getAchievementCategories() {
  return [...new Set(ACHIEVEMENTS.map(a => a.category))];
}

/**
 * Calculate achievement progress
 */
export function calculateAchievementProgress(achievement, playerStats) {
  const { type } = achievement.criteria;

  switch (type) {
    case "modelsCompleted":
      return Math.min(playerStats.totalCompletions || 0, achievement.criteria.count);

    case "perfectCompletion":
      return Math.min(playerStats.perfectCompletions || 0, achievement.criteria.count);

    case "speedBonus":
      return Math.min(playerStats.speedBonusCount || 0, achievement.criteria.count);

    case "totalCoinsEarned":
      return Math.min(playerStats.totalCoinsEarned || 0, achievement.criteria.count);

    case "totalDiamondsEarned":
      return Math.min(playerStats.totalDiamondsEarned || 0, achievement.criteria.count);

    case "perfectStreak":
      return Math.min(playerStats.currentPerfectStreak || 0, achievement.criteria.count);

    case "jackpotWon":
      return Math.min(playerStats.jackpotsWon || 0, achievement.criteria.count);

    case "levelReached":
      return playerStats.level >= achievement.criteria.level ? 1 : 0;

    default:
      return 0;
  }
}

/**
 * Check if achievement is unlocked
 */
export function isAchievementUnlocked(achievement, playerStats, unlockedAchievements = []) {
  // Already unlocked
  if (unlockedAchievements.includes(achievement.id)) {
    return true;
  }

  const { type } = achievement.criteria;

  switch (type) {
    case "modelsCompleted":
      return (playerStats.totalCompletions || 0) >= achievement.criteria.count;

    case "allModelsCompleted":
      return playerStats.allModelsComplete || false;

    case "packCompleted":
      return (playerStats.completedPacks || []).includes(achievement.criteria.packId);

    case "perfectCompletion":
      return (playerStats.perfectCompletions || 0) >= achievement.criteria.count;

    case "speedBonus":
      return (playerStats.speedBonusCount || 0) >= achievement.criteria.count;

    case "speedHalfPar":
      return (playerStats.halfParCompletions || 0) >= achievement.criteria.count;

    case "brushesUnlocked":
      return achievement.criteria.brushes.every(
        brush => (playerStats.unlockedBrushes || []).includes(brush)
      );

    case "allPacksUnlocked":
      return playerStats.allPacksUnlocked || false;

    case "totalCoinsEarned":
      return (playerStats.totalCoinsEarned || 0) >= achievement.criteria.count;

    case "totalDiamondsEarned":
      return (playerStats.totalDiamondsEarned || 0) >= achievement.criteria.count;

    case "coinsAtOnce":
      return (playerStats.coins || 0) >= achievement.criteria.count;

    case "perfectStreak":
      return (playerStats.bestPerfectStreak || 0) >= achievement.criteria.count;

    case "jackpotWon":
      return (playerStats.jackpotsWon || 0) >= achievement.criteria.count;

    case "levelReached":
      return (playerStats.level || 1) >= achievement.criteria.level;

    case "firstDiamond":
      return (playerStats.totalDiamondsEarned || 0) >= 1;

    case "perfectDifficulty":
      const key = `perfect_${achievement.criteria.difficulty}`;
      return (playerStats[key] || 0) >= 1;

    default:
      return false;
  }
}

/**
 * Check for newly unlocked achievements
 * Returns array of newly unlocked achievement IDs
 */
export function checkNewAchievements(playerStats, unlockedAchievements = []) {
  const newlyUnlocked = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedAchievements.includes(achievement.id)) {
      if (isAchievementUnlocked(achievement, playerStats, unlockedAchievements)) {
        newlyUnlocked.push(achievement.id);
      }
    }
  }

  return newlyUnlocked;
}
