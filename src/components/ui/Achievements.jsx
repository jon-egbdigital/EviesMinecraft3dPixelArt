import { useState } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import {
  ACHIEVEMENTS,
  getAchievementCategories,
  getAchievementsByCategory,
  calculateAchievementProgress,
  isAchievementUnlocked
} from '../../data/achievements'
import { useGameStore } from '../../stores/gameStore'

export function Achievements() {
  const { setPhase } = useGameStore()
  const unlockedAchievements = usePlayerStore((state) => state.unlockedAchievements)

  // Get individual stats to avoid creating new objects on every render
  const totalCompletions = usePlayerStore((state) => state.totalCompletions)
  const perfectCompletions = usePlayerStore((state) => state.perfectCompletions)
  const speedBonusCount = usePlayerStore((state) => state.speedBonusCount)
  const totalCoinsEarned = usePlayerStore((state) => state.totalCoinsEarned)
  const totalDiamondsEarned = usePlayerStore((state) => state.totalDiamondsEarned)
  const currentPerfectStreak = usePlayerStore((state) => state.currentPerfectStreak)
  const bestPerfectStreak = usePlayerStore((state) => state.bestPerfectStreak)
  const jackpotsWon = usePlayerStore((state) => state.jackpotsWon)
  const halfParCompletions = usePlayerStore((state) => state.halfParCompletions)
  const completedPacks = usePlayerStore((state) => state.completedPacks)
  const level = usePlayerStore((state) => state.level)
  const coins = usePlayerStore((state) => state.coins)
  const diamonds = usePlayerStore((state) => state.diamonds)
  const unlockedBrushes = usePlayerStore((state) => state.unlockedBrushes)
  const unlockedPacks = usePlayerStore((state) => state.unlockedPacks)
  const allModelsComplete = usePlayerStore((state) => state.allModelsComplete)
  const allPacksUnlocked = usePlayerStore((state) => state.allPacksUnlocked)
  const perfect_easy = usePlayerStore((state) => state.perfect_easy)
  const perfect_medium = usePlayerStore((state) => state.perfect_medium)
  const perfect_hard = usePlayerStore((state) => state.perfect_hard)

  // Build stats object
  const playerStats = {
    totalCompletions,
    perfectCompletions,
    speedBonusCount,
    totalCoinsEarned,
    totalDiamondsEarned,
    currentPerfectStreak,
    bestPerfectStreak,
    jackpotsWon,
    halfParCompletions,
    completedPacks,
    level,
    coins,
    diamonds,
    unlockedBrushes,
    unlockedPacks,
    allModelsComplete,
    allPacksUnlocked,
    perfect_easy,
    perfect_medium,
    perfect_hard
  }

  const categories = getAchievementCategories()
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter achievements
  const displayedAchievements = selectedCategory === 'all'
    ? ACHIEVEMENTS
    : getAchievementsByCategory(selectedCategory)

  // Calculate stats
  const totalAchievements = ACHIEVEMENTS.length
  const unlockedCount = unlockedAchievements.length
  const progress = Math.round((unlockedCount / totalAchievements) * 100)

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-b from-stone-800 to-stone-900 text-white p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400">Achievements</h1>
          <button
            onClick={() => setPhase('menu')}
            className="px-3 py-2 sm:px-6 sm:py-3 bg-stone-700 hover:bg-stone-600 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-colors"
          >
            Back to Menu
          </button>
        </div>

        {/* Progress Summary */}
        <div className="bg-stone-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-amber-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base sm:text-lg md:text-xl font-semibold">Overall Progress</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400">
              {unlockedCount} / {totalAchievements}
            </span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-3 sm:h-4 overflow-hidden border border-stone-600">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right mt-2 text-amber-300 font-semibold text-sm sm:text-base">
            {progress}% Complete
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors capitalize text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedAchievements.map((achievement) => {
            const unlocked = isAchievementUnlocked(achievement, playerStats, unlockedAchievements)
            const progress = calculateAchievementProgress(achievement, playerStats)
            const maxProgress = achievement.criteria.count || 1
            const progressPercent = maxProgress > 0 ? Math.round((progress / maxProgress) * 100) : 0

            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={unlocked}
                progress={progress}
                maxProgress={maxProgress}
                progressPercent={progressPercent}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AchievementCard({ achievement, unlocked, progress, maxProgress, progressPercent }) {
  return (
    <div
      className={`rounded-lg p-3 sm:p-4 border-2 transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-amber-900 to-yellow-900 border-amber-500'
          : 'bg-stone-800 border-stone-600 opacity-60'
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Icon */}
        <div
          className={`text-3xl sm:text-4xl ${
            unlocked ? 'grayscale-0' : 'grayscale opacity-50'
          }`}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-bold text-base sm:text-lg ${unlocked ? 'text-amber-300' : 'text-stone-400'}`}>
                {achievement.name}
              </h3>
              <p className={`text-xs sm:text-sm ${unlocked ? 'text-amber-100' : 'text-stone-500'}`}>
                {achievement.description}
              </p>
            </div>
            {unlocked && (
              <div className="text-xl sm:text-2xl">✓</div>
            )}
          </div>

          {/* Progress Bar (only show if not unlocked and has progress) */}
          {!unlocked && maxProgress > 1 && (
            <div className="mb-2">
              <div className="w-full bg-stone-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {progress} / {maxProgress}
              </div>
            </div>
          )}

          {/* Rewards */}
          <div className="flex gap-2 mt-2 text-sm">
            {achievement.reward?.coins && (
              <span className={`px-2 py-1 rounded ${unlocked ? 'bg-amber-700' : 'bg-stone-700'}`}>
                💰 {achievement.reward.coins}
              </span>
            )}
            {achievement.reward?.diamonds && (
              <span className={`px-2 py-1 rounded ${unlocked ? 'bg-amber-700' : 'bg-stone-700'}`}>
                💎 {achievement.reward.diamonds}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
