/**
 * Development helpers for testing
 * These functions are available in the browser console
 */

import { usePlayerStore } from '../stores/playerStore'
import { useGameStore } from '../stores/gameStore'

// Make stores available globally in development
if (import.meta.env.DEV) {
  window.__playerStore = usePlayerStore
  window.__gameStore = useGameStore

  // Helper functions
  window.__dev = {
    // Add currency for testing
    addCoins: (amount) => {
      usePlayerStore.getState().addCoins(amount)
      console.log(`Added ${amount} coins`)
    },

    addDiamonds: (amount) => {
      usePlayerStore.getState().addDiamonds(amount)
      console.log(`Added ${amount} diamonds`)
    },

    // Add XP for testing
    addXP: (amount) => {
      const result = usePlayerStore.getState().addXP(amount)
      console.log(`Added ${amount} XP`, result)
    },

    // View player state
    showPlayerState: () => {
      const state = usePlayerStore.getState()
      console.table({
        coins: state.coins,
        diamonds: state.diamonds,
        xp: state.xp,
        level: state.level,
        unlockedBrushes: state.unlockedBrushes.join(', '),
        completedModels: state.completedModels.join(', ')
      })
    },

    // Reset player data
    resetPlayer: () => {
      usePlayerStore.getState().resetPlayer()
      console.log('Player data reset')
    },

    // Clear localStorage
    clearStorage: () => {
      localStorage.clear()
      console.log('LocalStorage cleared - refresh to reset')
    },

    // Help
    help: () => {
      console.log(`
Available dev helpers:
- Press 'T' key: Auto-complete the current model
- __dev.addCoins(amount): Add coins
- __dev.addDiamonds(amount): Add diamonds
- __dev.addXP(amount): Add XP (check for level ups)
- __dev.showPlayerState(): View current player data
- __dev.resetPlayer(): Reset player progress
- __dev.clearStorage(): Clear all localStorage
      `)
    }
  }

  console.log('🎮 Dev helpers loaded! Type __dev.help() for available commands')
}
