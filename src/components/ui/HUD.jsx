import { usePlayerStore } from '../../stores/playerStore'
import { useProgress } from '../../hooks/useProgress'

function HUD() {
  const coins = usePlayerStore((state) => state.coins)
  const diamonds = usePlayerStore((state) => state.diamonds)
  const { currentLevel, progressPercent, currentXP, nextLevelXP, isMaxLevel } = useProgress()

  return (
    <>
      {/* Desktop: Separate boxes */}
      <div className="hidden md:block absolute top-36 left-4 space-y-3 pointer-events-auto">
        {/* Currency Display */}
        <div className="bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg border-2 border-gray-600 flex items-center gap-3">
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
        <div className="bg-gray-800 bg-opacity-90 px-4 py-3 rounded-lg border-2 border-gray-600">
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

      {/* Mobile: Combined compact box */}
      <div className="md:hidden absolute top-16 left-1 bg-gray-800 bg-opacity-90 px-1.5 py-1 rounded border border-gray-600 pointer-events-auto">
        {/* Currency row */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm">💰</span>
          <span className="text-yellow-400 font-bold text-xs">{coins}</span>
          <span className="text-sm">💎</span>
          <span className="text-cyan-400 font-bold text-xs">{diamonds}</span>
        </div>

        {/* Level row */}
        <div className="flex items-center gap-1">
          <span className="text-purple-400 font-bold text-xs">⭐{currentLevel}</span>
          {!isMaxLevel && (
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden min-w-[40px]">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${progressPercent * 100}%` }}
              />
            </div>
          )}
          {isMaxLevel && (
            <span className="text-yellow-400 text-xs font-bold">MAX</span>
          )}
        </div>
      </div>
    </>
  )
}

export default HUD
