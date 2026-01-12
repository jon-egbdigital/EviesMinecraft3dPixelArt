import { useMemo } from 'react'
import { usePlayerStore } from '../stores/playerStore'
import { getXPForNextLevel, getLevelProgress } from '../stores/playerStore'

/**
 * Hook for tracking player progression
 */
export function useProgress() {
  const xp = usePlayerStore((state) => state.xp)
  const level = usePlayerStore((state) => state.level)

  const progress = useMemo(() => {
    const nextLevelXP = getXPForNextLevel(level)
    const progressPercent = getLevelProgress(xp, level)

    return {
      currentXP: xp,
      currentLevel: level,
      nextLevelXP,
      progressPercent: Math.min(progressPercent, 1), // Cap at 100%
      isMaxLevel: nextLevelXP === null
    }
  }, [xp, level])

  return progress
}
