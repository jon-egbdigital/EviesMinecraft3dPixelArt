import { useState, useEffect } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { useGameStore } from '../../stores/gameStore'
import { getAllModels } from '../../data/models'
import { MODEL_PACKS, canAffordPack, canUnlockPack } from '../../data/model-packs'
import ModelPreview from './ModelPreview'

export default function ModelSelect() {
  const [models, setModels] = useState([])
  const [selectedPack, setSelectedPack] = useState('starter')
  const [loading, setLoading] = useState(true)

  const { coins, diamonds, level, unlockedPacks, unlockedModels, unlockPack } = usePlayerStore()
  const { setCurrentModel, setPhase } = useGameStore()

  useEffect(() => {
    async function loadModels() {
      const allModels = await getAllModels()
      setModels(allModels)
      setLoading(false)
    }
    loadModels()
  }, [])

  const handleSelectModel = (model) => {
    // Check if model is unlocked
    const pack = MODEL_PACKS.find(p => p.models.includes(model.id))
    const isPackUnlocked = pack && (pack.unlocked || unlockedPacks.includes(pack.id))

    if (isPackUnlocked) {
      setCurrentModel(model)
      setPhase('playing')
    }
  }

  const handleUnlockPack = (pack) => {
    if (!canAffordPack(pack, coins, diamonds)) {
      alert('Not enough currency!')
      return
    }

    if (!canUnlockPack(pack, level)) {
      alert(`You need to be level ${pack.requiredLevel} to unlock this pack!`)
      return
    }

    unlockPack(pack.id, pack.cost)
  }

  const filteredModels = models.filter(model => {
    const pack = MODEL_PACKS.find(p => p.models.includes(model.id))
    return pack && pack.id === selectedPack
  })

  const currentPack = MODEL_PACKS.find(p => p.id === selectedPack)
  const isPackUnlocked = currentPack && (currentPack.unlocked || unlockedPacks.includes(currentPack.id))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-800">
        <p className="text-2xl text-white">Loading models...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-800 text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Select a Model</h1>
        <div className="flex gap-4 text-lg">
          <span>💰 {coins}</span>
          <span>💎 {diamonds}</span>
          <span>⭐ Level {level}</span>
        </div>
      </div>

      {/* Pack Selector */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Model Packs</h2>
        <div className="flex gap-3 flex-wrap">
          {MODEL_PACKS.map(pack => {
            const unlocked = pack.unlocked || unlockedPacks.includes(pack.id)
            const canUnlock = canUnlockPack(pack, level)
            const canAfford = canAffordPack(pack, coins, diamonds)

            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`px-4 py-2 border-2 transition-colors ${
                  selectedPack === pack.id
                    ? 'bg-amber-600 border-amber-400'
                    : unlocked
                    ? 'bg-stone-700 border-stone-600 hover:bg-stone-600'
                    : 'bg-stone-900 border-stone-700 opacity-60'
                }`}
              >
                <div className="font-bold">{pack.name}</div>
                {!unlocked && pack.cost && (
                  <div className="text-sm mt-1">
                    {pack.cost.type === 'coins' ? '💰' : '💎'} {pack.cost.amount}
                  </div>
                )}
                {!unlocked && !canUnlock && (
                  <div className="text-xs text-red-400">Lvl {pack.requiredLevel}</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Unlock Pack Button */}
        {currentPack && !isPackUnlocked && currentPack.cost && (
          <div className="mt-4 p-4 bg-stone-900 border-2 border-stone-700 rounded">
            <h3 className="text-xl font-bold mb-2">{currentPack.name}</h3>
            <p className="mb-3">{currentPack.description}</p>
            <button
              onClick={() => handleUnlockPack(currentPack)}
              disabled={!canUnlockPack(currentPack, level) || !canAffordPack(currentPack, coins, diamonds)}
              className={`px-6 py-2 font-bold ${
                canUnlockPack(currentPack, level) && canAffordPack(currentPack, coins, diamonds)
                  ? 'bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400'
                  : 'bg-stone-700 border-2 border-stone-600 opacity-50 cursor-not-allowed'
              }`}
            >
              Unlock Pack - {currentPack.cost.type === 'coins' ? '💰' : '💎'} {currentPack.cost.amount}
            </button>
          </div>
        )}
      </div>

      {/* Model Grid */}
      {isPackUnlocked ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Choose Your Model</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredModels.map(model => {
              const completed = unlockedModels.includes(model.id)

              return (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className="bg-stone-700 border-2 border-stone-600 hover:border-amber-400 hover:bg-stone-600 p-4 transition-all relative"
                >
                  <div className="mb-3 relative">
                    <ModelPreview modelData={model} />
                    {completed && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{model.name}</h3>
                  <div className="flex justify-between text-sm text-stone-300">
                    <span className="capitalize">{model.difficulty}</span>
                    <span>{model.blocks.length} blocks</span>
                  </div>
                  {model.parTime && (
                    <div className="text-xs text-stone-400 mt-1">
                      ⏱️ Par: {model.parTime}s
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <div className="text-center text-stone-400 py-12">
          <p className="text-xl">🔒 Unlock this pack to access these models!</p>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => setPhase('menu')}
        className="mt-8 px-6 py-3 bg-stone-700 border-2 border-stone-600 hover:bg-stone-600 font-bold"
      >
        ← Back to Menu
      </button>
    </div>
  )
}
