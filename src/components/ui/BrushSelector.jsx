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
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800 bg-opacity-95 px-10 py-5 rounded-lg border-2 border-gray-600">
      <div className="flex items-center gap-10">
        {/* Active Brush Display */}
        <div className="flex items-center gap-3 pr-6 border-r-2 border-gray-600">
          <span className="text-white font-bold text-sm">🖌️ Brush:</span>
          <span className="text-yellow-400 font-bold">{activeBrushData?.name || 'Basic'}</span>
        </div>

        {/* Brush Selection */}
        <div className="flex gap-4">
          {availableBrushes.map(brush => (
            <button
              key={brush.id}
              onClick={() => handleBrushSelect(brush.id)}
              title={brush.description}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
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
        <div className="flex gap-4 pl-8 border-l-2 border-gray-600">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={undoCount === 0}
            title="Undo last action"
            className={`px-6 py-3 rounded-lg text-sm font-bold border-2 ${
              undoCount > 0
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-400'
                : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
            }`}
          >
            ↩️ Undo ({undoCount})
          </button>

          {/* Hint Button */}
          <button
            onClick={handleHint}
            disabled={hintCount === 0}
            title="Reveal a random unpainted block"
            className={`px-6 py-3 rounded-lg text-sm font-bold border-2 ${
              hintCount > 0
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-400'
                : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
            }`}
          >
            💡 Hint ({hintCount})
          </button>

          {/* X-Ray Toggle */}
          {unlockedBrushes.includes('x-ray') && (
            <button
              onClick={toggleXRayMode}
              title="Toggle X-Ray vision"
              className={`px-6 py-3 rounded-lg text-sm font-bold border-2 ${
                xRayMode
                  ? 'bg-green-600 text-white border-green-400'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
              }`}
            >
              👁️ X-Ray {xRayMode ? 'ON' : 'OFF'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
