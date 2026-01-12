import { useCallback } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { calculateRewards } from '../data/rewards'
import { playSound } from '../utils/soundManager'

/**
 * Hook for handling completion rewards
 */
export function useRewards() {
  const addCoins = usePlayerStore((state) => state.addCoins)
  const addDiamonds = usePlayerStore((state) => state.addDiamonds)
  const addXP = usePlayerStore((state) => state.addXP)
  const markModelCompleted = usePlayerStore((state) => state.markModelCompleted)
  const trackCompletion = usePlayerStore((state) => state.trackCompletion)

  const grantRewards = useCallback((modelData, mistakes, timeTaken) => {
    // Calculate what rewards the player should receive
    const rewards = calculateRewards(modelData, mistakes, timeTaken)

    // Play completion sound
    playSound('completion')

    // Grant XP
    const levelUpResult = addXP(rewards.xp)

    // Play level up sound if leveled up
    if (levelUpResult.leveledUp) {
      setTimeout(() => playSound('level_up'), 500)
    }

    // Grant loot with appropriate sounds
    const loot = rewards.loot
    const isJackpot = loot.type === 'jackpot'

    if (loot.type === 'coins') {
      addCoins(loot.amount)
      setTimeout(() => playSound('coin_reward'), 300)
    } else if (loot.type === 'diamonds') {
      addDiamonds(loot.amount)
      setTimeout(() => playSound('diamond_reward'), 300)
    } else if (isJackpot) {
      addCoins(loot.coins)
      addDiamonds(loot.diamonds)
      setTimeout(() => playSound('jackpot'), 300)
    }

    // Mark model as completed
    markModelCompleted(modelData.id)

    // Track completion for achievements
    const newAchievements = trackCompletion({
      modelId: modelData.id,
      difficulty: modelData.difficulty,
      mistakes,
      hasSpeedBonus: rewards.hasSpeedBonus,
      isJackpot,
      completionTime: timeTaken,
      parTime: modelData.parTime || 120
    })

    // Play achievement unlock sound if achievements were unlocked
    if (newAchievements && newAchievements.length > 0) {
      // Play different sounds based on achievement type
      const hasLegendary = newAchievements.some(a =>
        a.id === 'legendary' || a.id === 'completionist' || a.id === 'master_crafter'
      )
      const hasPerfectStreak = newAchievements.some(a =>
        a.id === 'triple_perfect' || a.id === 'unstoppable' || a.id === 'legendary'
      )

      if (hasLegendary) {
        setTimeout(() => playSound('legendary_achievement'), 700)
      } else if (hasPerfectStreak) {
        setTimeout(() => playSound('perfect_streak'), 700)
      } else {
        setTimeout(() => playSound('achievement_unlock'), 700)
      }
    }

    return {
      ...rewards,
      levelUpResult,
      newAchievements
    }
  }, [addCoins, addDiamonds, addXP, markModelCompleted, trackCompletion])

  return { grantRewards }
}
