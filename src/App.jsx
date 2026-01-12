import { useEffect, useMemo, useState } from 'react'
import GameCanvas from './components/game/GameCanvas'
import VoxelModel from './components/game/VoxelModel'
import ColorPalette from './components/ui/ColorPalette'
import CompletionModal from './components/ui/CompletionModal'
import HUD from './components/ui/HUD'
import Shop from './components/ui/Shop'
import BrushSelector from './components/ui/BrushSelector'
import MainMenu from './components/ui/MainMenu'
import ModelSelect from './components/ui/ModelSelect'
import Settings from './components/ui/Settings'
import { Achievements } from './components/ui/Achievements'
import { useGameStore } from './stores/gameStore'
import { useRewards } from './hooks/useRewards'
import { usePainting } from './hooks/usePainting'
import { preloadSounds, playMusic } from './utils/soundManager'
import './utils/devHelpers' // Load dev helpers in development mode

function App() {
  const {
    phase,
    currentModel,
    paintedBlocks,
    selectedColorId,
    isComplete,
    mistakes,
    startTime,
    xRayMode,
    hintBlock,
    setSelectedColor,
    paintBlock,
    resetGame
  } = useGameStore()

  const { grantRewards } = useRewards()
  const { handlePaint } = usePainting()
  const [currentRewards, setCurrentRewards] = useState(null)

  // Preload sounds on mount
  useEffect(() => {
    preloadSounds()
  }, [])

  // Lock scrolling during gameplay phase
  useEffect(() => {
    if (phase === 'playing') {
      document.body.classList.add('game-playing')
    } else {
      document.body.classList.remove('game-playing')
    }

    return () => document.body.classList.remove('game-playing')
  }, [phase])

  // Play appropriate music based on phase
  useEffect(() => {
    if (phase === 'playing') {
      playMusic('game_music')
    } else {
      playMusic('menu_music')
    }
  }, [phase])

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

  // Render different phases
  if (phase === 'menu') {
    return <MainMenu />
  }

  if (phase === 'modelSelect') {
    return <ModelSelect />
  }

  if (phase === 'shop') {
    return <Shop isOpen={true} onClose={() => {}} fullScreen={true} />
  }

  if (phase === 'settings') {
    return <Settings />
  }

  if (phase === 'achievements') {
    return <Achievements />
  }

  // Playing phase
  if (phase === 'playing') {
    if (!currentModel) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      )
    }

    const timeTaken = isComplete && startTime ? Date.now() - startTime : 0

    return (
      <div className="w-full h-full relative overflow-hidden">
        {/* 3D Canvas - behind everything, receives touch events */}
        <GameCanvas>
          <VoxelModel
            modelData={currentModel}
            paintedBlocks={paintedBlocks}
            onBlockClick={handleBlockClick}
            xRayMode={xRayMode}
            hintBlock={hintBlock}
          />
        </GameCanvas>

        {/* UI Overlay - pointer events only on interactive elements */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Title */}
          <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <h1 className="text-white text-base sm:text-xl md:text-2xl font-bold bg-gray-800 bg-opacity-90 px-3 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-3 rounded-lg border-2 border-gray-600">
              {currentModel.name}
            </h1>
          </div>

          {/* Menu button */}
          <button
            onClick={() => {
              if (window.confirm('Return to main menu? Current painting session will be lost.\n(Your coins, diamonds, and completed models are saved!)')) {
                useGameStore.getState().setPhase('menu')
              }
            }}
            className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gray-800 bg-opacity-90 hover:bg-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border-2 border-gray-600 transition-colors pointer-events-auto"
          >
            <span className="text-white font-bold text-lg sm:text-base md:text-lg">≡</span>
          </button>

          {/* Mistakes counter */}
          <div className="absolute top-16 sm:top-16 md:top-20 left-2 sm:left-4 bg-gray-800 bg-opacity-90 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-2 border-gray-600 pointer-events-auto">
            <span className="text-white font-bold text-sm sm:text-sm md:text-base">❌ </span>
            <span className={`font-bold text-sm sm:text-sm md:text-base ${mistakes === 0 ? 'text-green-400' : 'text-red-400'}`}>
              {mistakes}
            </span>
          </div>

          {/* HUD - Currency and Level */}
          <HUD />

          {/* Color Palette */}
          <ColorPalette
            selectedColorId={selectedColorId}
            onColorSelect={handleColorSelect}
            modelColors={modelColors}
          />

          {/* Brush Selector */}
          <BrushSelector />

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
      </div>
    )
  }

  // Default fallback
  return <MainMenu />
}

export default App
