import { usePlayerStore } from '../../stores/playerStore'
import { useProgress } from '../../hooks/useProgress'

function HUD() {
  const coins = usePlayerStore((state) => state.coins)
  const diamonds = usePlayerStore((state) => state.diamonds)
  const { currentLevel, progressPercent, currentXP, nextLevelXP, isMaxLevel } = useProgress()

  return (
    <div className="absolute top-24 sm:top-32 md:top-36 left-2 sm:left-4 space-y-2 sm:space-y-3 pointer-events-auto">
      {/* Currency Display */}
      <div className="bg-gray-800 bg-opacity-90 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg border-2 border-gray-600 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-lg sm:text-xl md:text-2xl">💰</span>
          <span className="text-yellow-400 font-bold text-sm sm:text-base md:text-lg">{coins}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-lg sm:text-xl md:text-2xl">💎</span>
          <span className="text-cyan-400 font-bold text-sm sm:text-base md:text-lg">{diamonds}</span>
        </div>
      </div>

      {/* Level and XP Display */}
      <div className="bg-gray-800 bg-opacity-90 px-2 py-1.5 sm:px-3 sm:py-2.5 md:px-4 md:py-3 rounded-lg border-2 border-gray-600">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <span className="text-purple-400 font-bold text-sm sm:text-base md:text-lg">⭐ Level {currentLevel}</span>
          {!isMaxLevel && (
            <span className="text-gray-400 text-xs sm:text-sm">
              {currentXP} / {nextLevelXP} XP
            </span>
          )}
        </div>

        {!isMaxLevel && (
          <div className="w-28 sm:w-36 md:w-40 h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercent * 100}%` }}
            />
          </div>
        )}

        {isMaxLevel && (
          <div className="text-yellow-400 text-xs sm:text-sm font-bold text-center">
            MAX LEVEL
          </div>
        )}
      </div>
    </div>
  )
}

export default HUD
