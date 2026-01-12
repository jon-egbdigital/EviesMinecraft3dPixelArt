import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'
import { BRUSHES, getBrushById } from '../../data/shop-items'

export default function BrushSelector() {
  const { activeBrush, setActiveBrush, xRayMode, toggleXRayMode } = useGameStore()
  const { unlockedBrushes, undoCount, hintCount, useUndo, useHint } = usePlayerStore()
  const { undo, showHint } = useGameStore()

  // Get only unlocked brushes
  const availableBrushes = BRUSHES.filter(brush => unlockedBrushes.includes(brush.id))

  const handleBrushSelect = (brushId) => {
    setActiveBrush(brushId)

    // If selecting X-Ray brush and mode is off, turn it on
    if (brushId === 'x-ray' && !xRayMode) {
      toggleXRayMode()
    }
    // If deselecting X-Ray brush and mode is on, turn it off
    else if (brushId !== 'x-ray' && xRayMode) {
      toggleXRayMode()
    }
  }

  const handleUndo = () => {
    if (undoCount > 0) {
      const success = useUndo()
      if (success) {
        undo()
      }
    }
  }

  const handleHint = () => {
    if (hintCount > 0) {
      const success = useHint()
      if (success) {
        showHint()
      }
    }
  }

  const activeBrushData = getBrushById(activeBrush)

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-95 px-2 py-2 sm:px-5 sm:py-3 rounded-lg border-2 border-gray-600 pointer-events-auto max-w-[calc(100vw-1rem)]">
      <div className="flex items-center gap-2 sm:gap-5 flex-wrap justify-center">
        {/* Active Brush Display - hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r-2 border-gray-600">
          <span className="text-white font-bold text-xs sm:text-sm">🖌️ Brush:</span>
          <span className="text-yellow-400 font-bold text-xs sm:text-base">{activeBrushData?.name || 'Basic'}</span>
        </div>

        {/* Mobile: Compact brush label */}
        <div className="sm:hidden flex items-center gap-1">
          <span className="text-white font-bold text-xs">🖌️</span>
          <span className="text-yellow-400 font-bold text-xs">{activeBrushData?.name || 'Basic'}</span>
        </div>

        {/* Brush Selection */}
        <div className="flex gap-1 sm:gap-2">
          {availableBrushes.map(brush => (
            <button
              key={brush.id}
              onClick={() => handleBrushSelect(brush.id)}
              title={brush.description}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                activeBrush === brush.id
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {brush.name}
            </button>
          ))}
        </div>

        {/* Utilities */}
        <div className="flex gap-1 sm:gap-2 pl-2 sm:pl-4 border-l-2 border-gray-600">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={undoCount === 0}
            title="Undo last action"
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border-2 active:scale-95 ${
              undoCount > 0
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-400'
                : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">↩️ Undo ({undoCount})</span>
            <span className="sm:hidden">↩️{undoCount}</span>
          </button>

          {/* Hint Button */}
          <button
            onClick={handleHint}
            disabled={hintCount === 0}
            title="Reveal a random unpainted block"
            className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border-2 active:scale-95 ${
              hintCount > 0
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-400'
                : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">💡 Hint ({hintCount})</span>
            <span className="sm:hidden">💡{hintCount}</span>
          </button>

          {/* X-Ray Toggle */}
          {unlockedBrushes.includes('x-ray') && (
            <button
              onClick={toggleXRayMode}
              title="Toggle X-Ray vision"
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-bold border-2 active:scale-95 ${
                xRayMode
                  ? 'bg-green-600 text-white border-green-400'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
              }`}
            >
              <span className="hidden sm:inline">👁️ X-Ray {xRayMode ? 'ON' : 'OFF'}</span>
              <span className="sm:hidden">👁️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
