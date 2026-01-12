import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'

export default function MainMenu() {
  const { setPhase } = useGameStore()
  const { coins = 0, diamonds = 0, level = 1, completedModels = [] } = usePlayerStore()

  return (
    <div className="min-h-screen bg-stone-800 text-white flex items-center justify-center p-4 sm:p-8">
      <div className="text-center max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4 text-amber-500">
          Minecraft
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          3D Color-by-Number
        </h2>

        {/* Player Stats */}
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 mb-8 sm:mb-12 text-sm sm:text-lg md:text-xl">
          <div className="bg-stone-900 border-2 border-stone-700 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3">
            💰 {coins ?? 0}
          </div>
          <div className="bg-stone-900 border-2 border-stone-700 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3">
            💎 {diamonds ?? 0}
          </div>
          <div className="bg-stone-900 border-2 border-stone-700 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3">
            ⭐ Level {level ?? 1}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 sm:mb-12">
          <p className="text-stone-400 text-sm sm:text-base md:text-lg">
            Models Completed: {completedModels?.length ?? 0}
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <button
            onClick={() => setPhase('modelSelect')}
            className="w-full max-w-md px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-emerald-600 hover:bg-emerald-500 border-2 sm:border-4 border-emerald-400 font-bold text-lg sm:text-xl md:text-2xl transition-colors"
          >
            ▶ PLAY
          </button>

          <button
            onClick={() => setPhase('shop')}
            className="w-full max-w-md px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-amber-600 hover:bg-amber-500 border-2 sm:border-4 border-amber-400 font-bold text-lg sm:text-xl md:text-2xl transition-colors"
          >
            🛒 SHOP
          </button>

          <button
            onClick={() => setPhase('achievements')}
            className="w-full max-w-md px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-purple-600 hover:bg-purple-500 border-2 sm:border-4 border-purple-400 font-bold text-lg sm:text-xl md:text-2xl transition-colors"
          >
            🏆 ACHIEVEMENTS
          </button>

          <button
            onClick={() => setPhase('settings')}
            className="w-full max-w-md px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-stone-700 hover:bg-stone-600 border-2 sm:border-4 border-stone-500 font-bold text-lg sm:text-xl md:text-2xl transition-colors"
          >
            ⚙️ SETTINGS
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-stone-500 text-xs sm:text-sm">
          <p>An EE Mush Bowles & Dad Project</p>
          <p>Built with React & Three.js</p>
        </div>
      </div>
    </div>
  )
}
