import { useState } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { useGameStore } from '../../stores/gameStore'

export default function Settings() {
  const { settings, updateSettings, resetPlayer } = usePlayerStore()
  const { setPhase } = useGameStore()

  const [musicVolume, setMusicVolume] = useState(settings.musicVolume)
  const [sfxVolume, setSfxVolume] = useState(settings.sfxVolume)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleSave = () => {
    updateSettings({
      musicVolume,
      sfxVolume,
    })
    alert('Settings saved!')
  }

  const handleReset = () => {
    resetPlayer()
    setShowResetConfirm(false)
    alert('Progress reset! Starting fresh.')
    setPhase('menu')
  }

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-stone-800 text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">Settings</h1>

        {/* Audio Settings */}
        <div className="bg-stone-900 border-2 border-stone-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Audio</h2>

          {/* Music Volume */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-base sm:text-lg mb-2">
              Music Volume: {Math.round(musicVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Sound Effects Volume */}
          <div className="mb-2 sm:mb-4">
            <label className="block text-base sm:text-lg mb-2">
              Sound Effects Volume: {Math.round(sfxVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-stone-900 border-2 border-stone-700 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About</h2>
          <p className="mb-2">Minecraft 3D Color-by-Number</p>
          <p className="text-stone-400 text-sm mb-4">
            A father-daughter project combining Minecraft aesthetics with color-by-number gameplay
          </p>
          <div className="text-sm text-stone-500">
            <p>Built with React, Three.js, and Zustand</p>
            <p>Version 1.0.0 - Phase 4 Complete</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950 border-2 border-red-800 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-400">Danger Zone</h2>
          <p className="mb-3 sm:mb-4 text-stone-300 text-sm sm:text-base">This action cannot be undone!</p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 sm:px-6 sm:py-2 bg-red-800 border-2 border-red-700 hover:bg-red-700 font-bold text-sm sm:text-base"
            >
              Reset All Progress
            </button>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <p className="text-yellow-400 font-bold text-sm sm:text-base">
                Are you sure? This will delete all your progress, currency, and unlocks!
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-red-600 border-2 border-red-500 hover:bg-red-500 font-bold text-sm sm:text-base"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-stone-700 border-2 border-stone-600 hover:bg-stone-600 font-bold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-emerald-600 border-2 border-emerald-500 hover:bg-emerald-500 font-bold text-sm sm:text-base"
          >
            Save Settings
          </button>
          <button
            onClick={() => setPhase('menu')}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-stone-700 border-2 border-stone-600 hover:bg-stone-600 font-bold text-sm sm:text-base"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}
