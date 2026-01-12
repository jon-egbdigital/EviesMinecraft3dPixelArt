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

      // Consumable items
      undoCount: 0,
      hintCount: 0,

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

      unlockBrush: (brushId) => set((state) => {
        if (state.unlockedBrushes.includes(brushId)) return state
        return { unlockedBrushes: [...state.unlockedBrushes, brushId] }
      }),

      unlockModel: (modelId) => set((state) => {
        if (state.unlockedModels.includes(modelId)) return state
        return { unlockedModels: [...state.unlockedModels, modelId] }
      }),

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

      // Reset (for testing)
      resetPlayer: () => set({
        coins: 0,
        diamonds: 0,
        xp: 0,
        level: 1,
        unlockedBrushes: ['basic'],
        unlockedModels: ['sword'],
        completedModels: [],
        undoCount: 0,
        hintCount: 0,
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
