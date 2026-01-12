import { useGameStore } from '../../stores/gameStore'

function CompletionModal({ onClose, mistakes, timeTaken, rewards }) {
  const { setPhase } = useGameStore()
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderRewardDisplay = () => {
    if (!rewards || !rewards.loot) return null

    const { loot } = rewards

    if (loot.type === 'coins') {
      return (
        <div className="text-2xl font-bold text-yellow-400">
          💰 {loot.amount} Coins
        </div>
      )
    } else if (loot.type === 'diamonds') {
      return (
        <div className="text-2xl font-bold text-cyan-400">
          💎 {loot.amount} Diamond{loot.amount > 1 ? 's' : ''}
        </div>
      )
    } else if (loot.type === 'jackpot') {
      return (
        <div className="space-y-2">
          <div className="text-2xl font-bold text-yellow-400">
            💰 {loot.coins} Coins
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            💎 {loot.diamonds} Diamonds
          </div>
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 border-4 border-yellow-500 rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-6">
          🎉 YOU WIN! 🎉
        </h1>

        <div className="bg-gray-700 rounded p-4 mb-6 space-y-3">
          <div className="flex justify-between text-white text-lg">
            <span>Time:</span>
            <span className="font-bold">{formatTime(timeTaken)}</span>
          </div>
          <div className="flex justify-between text-white text-lg">
            <span>Mistakes:</span>
            <span className={`font-bold ${mistakes === 0 ? 'text-green-400' : 'text-red-400'}`}>
              {mistakes}
            </span>
          </div>
          {mistakes === 0 && (
            <div className="text-green-400 text-center font-bold mt-2">
              ⭐ PERFECT! No mistakes! ⭐
            </div>
          )}
        </div>

        {/* Rewards Section */}
        {rewards && (
          <div className="bg-gray-900 rounded p-6 mb-6 border-2 border-yellow-600">
            <h2 className="text-xl font-bold text-yellow-300 text-center mb-4">
              {rewards.loot.message}
            </h2>

            <div className="text-center mb-4">
              {renderRewardDisplay()}
            </div>

            <div className="text-center space-y-2">
              <div className="text-lg text-purple-400 font-bold">
                ⭐ +{rewards.xp} XP
              </div>
              {rewards.levelUpResult?.leveledUp && (
                <div className="text-xl text-green-400 font-bold animate-pulse">
                  🎊 LEVEL UP! Level {rewards.levelUpResult.newLevel}! 🎊
                </div>
              )}
              {rewards.coinMultiplier > 1 && (
                <div className="text-sm text-yellow-300">
                  {rewards.isPerfect && '✨ Perfect Bonus! '}
                  {rewards.difficulty === 'hard' && '💪 Hard Mode Bonus! '}
                  ({rewards.coinMultiplier}x multiplier)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {rewards?.newAchievements && rewards.newAchievements.length > 0 && (
          <div className="bg-gradient-to-br from-amber-900 to-yellow-900 rounded p-6 mb-6 border-2 border-amber-500">
            <h2 className="text-xl font-bold text-amber-300 text-center mb-4">
              🏆 Achievements Unlocked! 🏆
            </h2>
            <div className="space-y-3">
              {rewards.newAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-amber-800 bg-opacity-50 rounded p-3 border border-amber-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-amber-200">{achievement.name}</div>
                      <div className="text-sm text-amber-100">{achievement.description}</div>
                      {achievement.reward && (
                        <div className="flex gap-2 mt-1 text-xs">
                          {achievement.reward.coins && (
                            <span className="text-yellow-300">💰 +{achievement.reward.coins}</span>
                          )}
                          {achievement.reward.diamonds && (
                            <span className="text-cyan-300">💎 +{achievement.reward.diamonds}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setPhase('modelSelect')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded border-2 border-emerald-400 transition-colors"
          >
            ▶ Next Model
          </button>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded border-2 border-blue-400 transition-colors"
          >
            🔄 Play Again
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPhase('shop')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded border-2 border-amber-400 transition-colors"
            >
              🛒 Shop
            </button>
            <button
              onClick={() => setPhase('menu')}
              className="bg-stone-700 hover:bg-stone-600 text-white font-bold py-2 px-4 rounded border-2 border-stone-500 transition-colors"
            >
              ≡ Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompletionModal
