import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { checkNewAchievements, getAchievementById } from '../data/achievements'

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Currency
      coins: 0,
      diamonds: 0,

      // Progression
      xp: 0,
      level: 1,

      // Unlocks
      unlockedBrushes: ['basic'],
      unlockedModels: ['sword'],
      unlockedPacks: ['starter'],
      completedModels: [],

      // Consumable items
      undoCount: 0,
      hintCount: 0,

      // Settings
      settings: {
        musicVolume: 0.25,  // Reduced from 0.5 to 0.25 (50% quieter)
        sfxVolume: 0.8,
      },

      // Achievements
      unlockedAchievements: [],

      // Achievement tracking stats
      totalCompletions: 0,
      perfectCompletions: 0,
      speedBonusCount: 0,
      totalCoinsEarned: 0,
      totalDiamondsEarned: 0,
      currentPerfectStreak: 0,
      bestPerfectStreak: 0,
      jackpotsWon: 0,
      completedPacks: [],
      halfParCompletions: 0,
      perfect_easy: 0,
      perfect_medium: 0,
      perfect_hard: 0,
      allModelsComplete: false,
      allPacksUnlocked: false,

      // Actions
      addCoins: (amount) => set((state) => ({
        coins: state.coins + amount,
        totalCoinsEarned: state.totalCoinsEarned + amount
      })),

      addDiamonds: (amount) => set((state) => ({
        diamonds: state.diamonds + amount,
        totalDiamondsEarned: state.totalDiamondsEarned + amount
      })),

      spendCoins: (amount) => {
        const state = get()
        if (state.coins >= amount) {
          set({ coins: state.coins - amount })
          return true
        }
        return false
      },

      spendDiamonds: (amount) => {
        const state = get()
        if (state.diamonds >= amount) {
          set({ diamonds: state.diamonds - amount })
          return true
        }
        return false
      },

      addXP: (amount) => {
        const state = get()
        const newXP = state.xp + amount
        const newLevel = calculateLevel(newXP)

        set({ xp: newXP })

        // Check for level up
        if (newLevel > state.level) {
          set({ level: newLevel })
          return { leveledUp: true, newLevel }
        }

        return { leveledUp: false }
      },

      unlockBrush: (brushId) => set((state) => {
        if (state.unlockedBrushes.includes(brushId)) return state
        return { unlockedBrushes: [...state.unlockedBrushes, brushId] }
      }),

      unlockModel: (modelId) => set((state) => {
        if (state.unlockedModels.includes(modelId)) return state
        return { unlockedModels: [...state.unlockedModels, modelId] }
      }),

      unlockPack: (packId, cost) => {
        const state = get()

        // Check if already unlocked
        if (state.unlockedPacks.includes(packId)) return false

        // Deduct cost
        if (cost) {
          if (cost.type === 'coins') {
            if (!state.spendCoins(cost.amount)) return false
          } else if (cost.type === 'diamonds') {
            if (!state.spendDiamonds(cost.amount)) return false
          }
        }

        // Unlock the pack
        set({ unlockedPacks: [...state.unlockedPacks, packId] })
        return true
      },

      addUndos: (count) => set((state) => ({
        undoCount: state.undoCount + count
      })),

      useUndo: () => {
        const state = get()
        if (state.undoCount > 0) {
          set({ undoCount: state.undoCount - 1 })
          return true
        }
        return false
      },

      addHints: (count) => set((state) => ({
        hintCount: state.hintCount + count
      })),

      useHint: () => {
        const state = get()
        if (state.hintCount > 0) {
          set({ hintCount: state.hintCount - 1 })
          return true
        }
        return false
      },

      markModelCompleted: (modelId) => set((state) => {
        if (!state.completedModels.includes(modelId)) {
          return { completedModels: [...state.completedModels, modelId] }
        }
        return state
      }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Achievement actions
      unlockAchievement: (achievementId) => {
        const state = get()
        if (state.unlockedAchievements.includes(achievementId)) {
          return null
        }

        // Get achievement and award rewards
        const achievement = getAchievementById(achievementId)
        if (!achievement) return null

        // Add to unlocked list
        set({
          unlockedAchievements: [...state.unlockedAchievements, achievementId]
        })

        // Award rewards
        if (achievement.reward) {
          if (achievement.reward.coins) {
            get().addCoins(achievement.reward.coins)
          }
          if (achievement.reward.diamonds) {
            get().addDiamonds(achievement.reward.diamonds)
          }
        }

        return achievement
      },

      trackCompletion: (completionData) => {
        const state = get()
        const {
          modelId,
          difficulty,
          mistakes,
          hasSpeedBonus,
          isJackpot,
          completionTime,
          parTime
        } = completionData

        const isPerfect = mistakes === 0
        const isHalfPar = completionTime <= parTime / 2

        // Update basic stats
        set({
          totalCompletions: state.totalCompletions + 1,
          perfectCompletions: isPerfect ? state.perfectCompletions + 1 : state.perfectCompletions,
          speedBonusCount: hasSpeedBonus ? state.speedBonusCount + 1 : state.speedBonusCount,
          jackpotsWon: isJackpot ? state.jackpotsWon + 1 : state.jackpotsWon,
          halfParCompletions: isHalfPar ? state.halfParCompletions + 1 : state.halfParCompletions
        })

        // Update perfect streak
        if (isPerfect) {
          const newStreak = state.currentPerfectStreak + 1
          set({
            currentPerfectStreak: newStreak,
            bestPerfectStreak: Math.max(newStreak, state.bestPerfectStreak)
          })
        } else {
          set({ currentPerfectStreak: 0 })
        }

        // Track perfect by difficulty
        if (isPerfect && difficulty) {
          const key = `perfect_${difficulty}`
          set({ [key]: (state[key] || 0) + 1 })
        }

        // Check for new achievements
        return get().checkAchievements()
      },

      checkAchievements: () => {
        const state = get()

        // Get player stats for achievement checking
        const playerStats = {
          totalCompletions: state.totalCompletions,
          perfectCompletions: state.perfectCompletions,
          speedBonusCount: state.speedBonusCount,
          totalCoinsEarned: state.totalCoinsEarned,
          totalDiamondsEarned: state.totalDiamondsEarned,
          currentPerfectStreak: state.currentPerfectStreak,
          bestPerfectStreak: state.bestPerfectStreak,
          jackpotsWon: state.jackpotsWon,
          halfParCompletions: state.halfParCompletions,
          completedPacks: state.completedPacks,
          level: state.level,
          coins: state.coins,
          diamonds: state.diamonds,
          unlockedBrushes: state.unlockedBrushes,
          unlockedPacks: state.unlockedPacks,
          allModelsComplete: state.allModelsComplete,
          allPacksUnlocked: state.allPacksUnlocked,
          perfect_easy: state.perfect_easy,
          perfect_medium: state.perfect_medium,
          perfect_hard: state.perfect_hard
        }

        const newAchievements = checkNewAchievements(playerStats, state.unlockedAchievements)

        // Unlock each new achievement
        const unlockedDetails = []
        for (const achievementId of newAchievements) {
          const achievement = get().unlockAchievement(achievementId)
          if (achievement) {
            unlockedDetails.push(achievement)
          }
        }

        return unlockedDetails
      },

      markPackCompleted: (packId) => set((state) => {
        if (!state.completedPacks.includes(packId)) {
          return { completedPacks: [...state.completedPacks, packId] }
        }
        return state
      }),

      // Reset (for testing)
      resetPlayer: () => set({
        coins: 0,
        diamonds: 0,
        xp: 0,
        level: 1,
        unlockedBrushes: ['basic'],
        unlockedModels: ['sword'],
        unlockedPacks: ['starter'],
        completedModels: [],
        undoCount: 0,
        hintCount: 0,
        unlockedAchievements: [],
        totalCompletions: 0,
        perfectCompletions: 0,
        speedBonusCount: 0,
        totalCoinsEarned: 0,
        totalDiamondsEarned: 0,
        currentPerfectStreak: 0,
        bestPerfectStreak: 0,
        jackpotsWon: 0,
        completedPacks: [],
        halfParCompletions: 0,
        perfect_easy: 0,
        perfect_medium: 0,
        perfect_hard: 0,
        allModelsComplete: false,
        allPacksUnlocked: false,
      }),
    }),
    {
      name: 'minecraft-pixel-art-player',
    }
  )
)

// XP thresholds for each level
const XP_PER_LEVEL = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  4000,   // Level 7
  7500,   // Level 8
  12000,  // Level 9
  20000,  // Level 10
]

function calculateLevel(xp) {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) {
      return i + 1
    }
  }
  return 1
}

// Helper to get XP needed for next level
export function getXPForNextLevel(currentLevel) {
  if (currentLevel >= XP_PER_LEVEL.length) {
    return null // Max level
  }
  return XP_PER_LEVEL[currentLevel]
}

// Helper to get current level progress (0-1)
export function getLevelProgress(xp, currentLevel) {
  if (currentLevel >= XP_PER_LEVEL.length) {
    return 1 // Max level
  }

  const currentLevelXP = XP_PER_LEVEL[currentLevel - 1]
  const nextLevelXP = XP_PER_LEVEL[currentLevel]
  const progressXP = xp - currentLevelXP
  const requiredXP = nextLevelXP - currentLevelXP

  return progressXP / requiredXP
}
