import { useEffect, useMemo, useState } from 'react'
import GameCanvas from './components/game/GameCanvas'
import VoxelModel from './components/game/VoxelModel'
import ColorPalette from './components/ui/ColorPalette'
import CompletionModal from './components/ui/CompletionModal'
import HUD from './components/ui/HUD'
import Shop from './components/ui/Shop'
import BrushSelector from './components/ui/BrushSelector'
import { useGameStore } from './stores/gameStore'
import { useRewards } from './hooks/useRewards'
import { usePainting } from './hooks/usePainting'
import swordModel from './data/models/sword.json'
import './utils/devHelpers' // Load dev helpers in development mode

function App() {
  const {
    currentModel,
    paintedBlocks,
    selectedColorId,
    isComplete,
    mistakes,
    startTime,
    xRayMode,
    hintBlock,
    setCurrentModel,
    setSelectedColor,
    paintBlock,
    resetGame
  } = useGameStore()

  const { grantRewards } = useRewards()
  const { handlePaint } = usePainting()
  const [currentRewards, setCurrentRewards] = useState(null)
  const [shopOpen, setShopOpen] = useState(false)

  // Load the sword model on mount
  useEffect(() => {
    setCurrentModel(swordModel)
  }, [setCurrentModel])

  // Get unique color IDs used in the model
  const modelColors = useMemo(() => {
    if (!currentModel) return []
    return [...new Set(currentModel.blocks.map(b => b.colorId))]
  }, [currentModel])

  // Auto-select first color when model loads
  useEffect(() => {
    if (modelColors.length > 0 && !selectedColorId) {
      setSelectedColor(modelColors[0])
    }
  }, [modelColors, selectedColorId, setSelectedColor])

  // Test mode: Press 'T' to auto-complete the game
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 't' || e.key === 'T') {
        // Auto-paint all blocks with correct colors
        if (currentModel && !isComplete) {
          currentModel.blocks.forEach(block => {
            paintBlock([block.x, block.y, block.z], block.colorId)
          })
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentModel, paintBlock, isComplete])

  const handleBlockClick = (position, colorId) => {
    if (!selectedColorId || isComplete) return false
    return handlePaint(position, selectedColorId)
  }

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId)
  }

  const handlePlayAgain = () => {
    setCurrentRewards(null)
    resetGame()
  }

  // Grant rewards when game is completed
  useEffect(() => {
    if (isComplete && currentModel && !currentRewards) {
      const timeTaken = Date.now() - startTime
      const rewards = grantRewards(currentModel, mistakes, timeTaken)
      console.log('🎉 Game completed! Rewards granted:', rewards)
      setCurrentRewards(rewards)
    }
  }, [isComplete, currentModel, mistakes, startTime, grantRewards, currentRewards])

  if (!currentModel) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  const timeTaken = isComplete && startTime ? Date.now() - startTime : 0

  return (
    <div className="w-full h-full relative">
      {/* Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="text-white text-2xl font-bold bg-gray-800 bg-opacity-90 px-6 py-3 rounded-lg border-2 border-gray-600">
          {currentModel.name}
        </h1>
      </div>

      {/* HUD - Currency and Level */}
      <HUD />

      {/* Shop Button */}
      <button
        onClick={() => setShopOpen(true)}
        className="absolute top-4 left-4 z-10 bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg border-2 border-green-500"
      >
        🛒 SHOP
      </button>

      {/* Mistakes counter */}
      <div className="absolute top-20 left-4 z-10 bg-gray-800 bg-opacity-90 px-6 py-3 rounded-lg border-2 border-gray-600">
        <span className="text-white font-bold">Mistakes: </span>
        <span className={`font-bold ${mistakes === 0 ? 'text-green-400' : 'text-red-400'}`}>
          {mistakes}
        </span>
      </div>

      {/* 3D Canvas */}
      <GameCanvas>
        <VoxelModel
          modelData={currentModel}
          paintedBlocks={paintedBlocks}
          onBlockClick={handleBlockClick}
          xRayMode={xRayMode}
          hintBlock={hintBlock}
        />
      </GameCanvas>

      {/* Color Palette */}
      <ColorPalette
        selectedColorId={selectedColorId}
        onColorSelect={handleColorSelect}
        modelColors={modelColors}
      />

      {/* Brush Selector */}
      <BrushSelector />

      {/* Shop Modal */}
      <Shop isOpen={shopOpen} onClose={() => setShopOpen(false)} />

      {/* Completion Modal */}
      {isComplete && (
        <CompletionModal
          onClose={handlePlayAgain}
          mistakes={mistakes}
          timeTaken={timeTaken}
          rewards={currentRewards}
        />
      )}
    </div>
  )
}

export default App
