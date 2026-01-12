import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      completedModels: [],

      // Settings
      settings: {
        musicVolume: 0.5,
        sfxVolume: 0.8,
      },

      // Actions
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

      addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),

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

      unlockBrush: (brushId) => set((state) => ({
        unlockedBrushes: [...state.unlockedBrushes, brushId]
      })),

      unlockModel: (modelId) => set((state) => ({
        unlockedModels: [...state.unlockedModels, modelId]
      })),

      markModelCompleted: (modelId) => set((state) => {
        if (!state.completedModels.includes(modelId)) {
          return { completedModels: [...state.completedModels, modelId] }
        }
        return state
      }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Reset (for testing)
      resetPlayer: () => set({
        coins: 0,
        diamonds: 0,
        xp: 0,
        level: 1,
        unlockedBrushes: ['basic'],
        unlockedModels: ['sword'],
        completedModels: [],
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
