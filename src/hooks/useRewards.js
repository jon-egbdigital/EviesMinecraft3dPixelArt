import { useCallback } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { calculateRewards } from '../data/rewards'

/**
 * Hook for handling completion rewards
 */
export function useRewards() {
  const addCoins = usePlayerStore((state) => state.addCoins)
  const addDiamonds = usePlayerStore((state) => state.addDiamonds)
  const addXP = usePlayerStore((state) => state.addXP)
  const markModelCompleted = usePlayerStore((state) => state.markModelCompleted)

  const grantRewards = useCallback((modelData, mistakes, timeTaken) => {
    // Calculate what rewards the player should receive
    const rewards = calculateRewards(modelData, mistakes, timeTaken)

    // Grant XP
    const levelUpResult = addXP(rewards.xp)

    // Grant loot
    const loot = rewards.loot
    if (loot.type === 'coins') {
      addCoins(loot.amount)
    } else if (loot.type === 'diamonds') {
      addDiamonds(loot.amount)
    } else if (loot.type === 'jackpot') {
      addCoins(loot.coins)
      addDiamonds(loot.diamonds)
    }

    // Mark model as completed
    markModelCompleted(modelData.id)

    return {
      ...rewards,
      levelUpResult
    }
  }, [addCoins, addDiamonds, addXP, markModelCompleted])

  return { grantRewards }
}
