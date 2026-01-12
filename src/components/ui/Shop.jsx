import { useState } from 'react'
import { usePlayerStore } from '../../stores/playerStore'
import { BRUSHES, UTILITIES, canAfford, canUnlock } from '../../data/shop-items'

export default function Shop({ isOpen, onClose }) {
  const {
    coins,
    diamonds,
    level,
    unlockedBrushes,
    undoCount,
    hintCount,
    spendCoins,
    spendDiamonds,
    unlockBrush,
    addUndos,
    addHints
  } = usePlayerStore()

  const [activeTab, setActiveTab] = useState('brushes')
  const [confirmPurchase, setConfirmPurchase] = useState(null)

  if (!isOpen) return null

  const handlePurchase = (item) => {
    // Check if already purchased (for brushes)
    if (item.id && unlockedBrushes.includes(item.id) && !item.consumable) {
      return // Already owned
    }

    // Check if can afford
    if (!canAfford(item, coins, diamonds)) {
      return
    }

    // Check level requirement
    if (!canUnlock(item, level)) {
      return
    }

    setConfirmPurchase(item)
  }

  const confirmBuy = () => {
    if (!confirmPurchase) return

    const item = confirmPurchase

    // Spend currency
    let success = false
    if (item.cost.type === 'coins') {
      success = spendCoins(item.cost.amount)
    } else if (item.cost.type === 'diamonds') {
      success = spendDiamonds(item.cost.amount)
    }

    if (!success) {
      setConfirmPurchase(null)
      return
    }

    // Grant the item
    if (item.consumable) {
      // Utility items
      if (item.id === 'undo-pack') {
        addUndos(3)
      } else if (item.id === 'hint-pack') {
        addHints(3)
      }
    } else {
      // Brushes
      unlockBrush(item.id)
    }

    setConfirmPurchase(null)
  }

  const cancelPurchase = () => {
    setConfirmPurchase(null)
  }

  const renderBrushCard = (brush) => {
    const isOwned = unlockedBrushes.includes(brush.id)
    const affordable = canAfford(brush, coins, diamonds)
    const levelMet = canUnlock(brush, level)
    const canBuy = !isOwned && affordable && levelMet

    return (
      <div
        key={brush.id}
        className={`bg-gray-800 border-2 p-4 rounded-lg ${
          isOwned ? 'border-green-500' : canBuy ? 'border-gray-600' : 'border-gray-700 opacity-60'
        }`}
      >
        <h3 className="text-lg font-bold text-white mb-2">{brush.name}</h3>
        <p className="text-gray-400 text-sm mb-2">{brush.description}</p>
        <p className="text-gray-300 text-xs mb-3 italic">{brush.effect}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            {brush.cost.type === 'coins' && (
              <span className="text-yellow-400">💰 {brush.cost.amount}</span>
            )}
            {brush.cost.type === 'diamonds' && (
              <span className="text-cyan-400">💎 {brush.cost.amount}</span>
            )}
          </div>

          {isOwned ? (
            <span className="text-green-400 text-sm font-bold">OWNED</span>
          ) : !levelMet ? (
            <span className="text-red-400 text-xs">Level {brush.requiredLevel} Required</span>
          ) : (
            <button
              onClick={() => handlePurchase(brush)}
              disabled={!canBuy}
              className={`px-3 py-2 rounded-lg text-sm font-bold ${
                canBuy
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {affordable ? 'BUY' : 'TOO EXPENSIVE'}
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderUtilityCard = (utility) => {
    const affordable = canAfford(utility, coins, diamonds)

    return (
      <div
        key={utility.id}
        className={`bg-gray-800 border-2 p-4 rounded-lg ${
          affordable ? 'border-gray-600' : 'border-gray-700 opacity-60'
        }`}
      >
        <h3 className="text-lg font-bold text-white mb-2">{utility.name}</h3>
        <p className="text-gray-400 text-sm mb-2">{utility.description}</p>
        <p className="text-gray-300 text-xs mb-3 italic">{utility.effect}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            {utility.cost.type === 'coins' && (
              <span className="text-yellow-400">💰 {utility.cost.amount}</span>
            )}
            {utility.cost.type === 'diamonds' && (
              <span className="text-cyan-400">💎 {utility.cost.amount}</span>
            )}
          </div>

          <button
            onClick={() => handlePurchase(utility)}
            disabled={!affordable}
            className={`px-3 py-2 rounded-lg text-sm font-bold ${
              affordable
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {affordable ? 'BUY' : 'TOO EXPENSIVE'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-4 border-gray-700 rounded-lg p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-bold text-white pl-1">SHOP</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-red-400 font-bold pr-1"
          >
            ✕
          </button>
        </div>

        {/* Currency Display */}
        <div className="flex gap-3 mb-5">
          <div className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-yellow-600">
            <span className="text-yellow-400 font-bold">💰 {coins}</span>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-cyan-600">
            <span className="text-cyan-400 font-bold">💎 {diamonds}</span>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-gray-600">
            <span className="text-white font-bold">Level {level}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab('brushes')}
            className={`px-5 py-2 rounded-lg font-bold ${
              activeTab === 'brushes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            BRUSHES
          </button>
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-5 py-2 rounded-lg font-bold ${
              activeTab === 'utilities'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            UTILITIES
          </button>
        </div>

        {/* Utility Inventory Display */}
        {activeTab === 'utilities' && (
          <div className="mb-4 flex gap-3">
            <div className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-purple-600">
              <span className="text-purple-400 font-bold">↩️ Undos: {undoCount}</span>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-orange-600">
              <span className="text-orange-400 font-bold">💡 Hints: {hintCount}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === 'brushes' && BRUSHES.map(renderBrushCard)}
          {activeTab === 'utilities' && UTILITIES.map(renderUtilityCard)}
        </div>

        {/* Confirmation Modal */}
        {confirmPurchase && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-4 border-yellow-600 rounded-lg p-5 max-w-md">
              <h3 className="text-xl font-bold text-white mb-4 pl-1">Confirm Purchase</h3>
              <p className="text-gray-300 mb-4 px-1">
                Buy <span className="font-bold text-white">{confirmPurchase.name}</span> for{' '}
                {confirmPurchase.cost.type === 'coins' && (
                  <span className="text-yellow-400 font-bold">💰 {confirmPurchase.cost.amount}</span>
                )}
                {confirmPurchase.cost.type === 'diamonds' && (
                  <span className="text-cyan-400 font-bold">💎 {confirmPurchase.cost.amount}</span>
                )}
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmBuy}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  YES
                </button>
                <button
                  onClick={cancelPurchase}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
