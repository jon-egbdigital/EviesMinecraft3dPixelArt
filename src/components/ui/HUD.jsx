import { usePlayerStore } from '../../stores/playerStore'
import { useProgress } from '../../hooks/useProgress'

function HUD() {
  const coins = usePlayerStore((state) => state.coins)
  const diamonds = usePlayerStore((state) => state.diamonds)
  const { currentLevel, progressPercent, currentXP, nextLevelXP, isMaxLevel } = useProgress()

  return (
    <div className="absolute top-4 right-4 z-10 space-y-2">
      {/* Currency Display */}
      <div className="bg-gray-800 bg-opacity-90 px-4 py-2 rounded border-2 border-gray-600 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-yellow-400 font-bold text-lg">{coins}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="text-cyan-400 font-bold text-lg">{diamonds}</span>
        </div>
      </div>

      {/* Level and XP Display */}
      <div className="bg-gray-800 bg-opacity-90 px-4 py-3 rounded border-2 border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-400 font-bold text-lg">⭐ Level {currentLevel}</span>
          {!isMaxLevel && (
            <span className="text-gray-400 text-sm">
              {currentXP} / {nextLevelXP} XP
            </span>
          )}
        </div>

        {!isMaxLevel && (
          <div className="w-40 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercent * 100}%` }}
            />
          </div>
        )}

        {isMaxLevel && (
          <div className="text-yellow-400 text-sm font-bold text-center">
            MAX LEVEL
          </div>
        )}
      </div>
    </div>
  )
}

export default HUD
