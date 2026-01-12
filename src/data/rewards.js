import { randomAmount } from '../utils/lootTable'

/**
 * Loot table for completion rewards
 * Weight determines probability (higher = more likely)
 */
export const COMPLETION_LOOT_TABLE = [
  {
    id: 'coins_small',
    weight: 60,
    name: 'Coins',
    getReward: () => ({
      type: 'coins',
      amount: randomAmount(5, 15),
      message: 'Some coins!'
    })
  },
  {
    id: 'coins_large',
    weight: 20,
    name: 'Bonus Coins',
    getReward: () => ({
      type: 'coins',
      amount: randomAmount(20, 30),
      message: 'Lots of coins!'
    })
  },
  {
    id: 'diamond_single',
    weight: 15,
    name: 'Diamond',
    getReward: () => ({
      type: 'diamonds',
      amount: 1,
      message: 'A diamond! ✨'
    })
  },
  {
    id: 'diamond_triple',
    weight: 4,
    name: 'Triple Diamonds',
    getReward: () => ({
      type: 'diamonds',
      amount: 3,
      message: 'Triple diamonds! 💎💎💎'
    })
  },
  {
    id: 'jackpot',
    weight: 1,
    name: 'Jackpot',
    getReward: () => ({
      type: 'jackpot',
      coins: 50,
      diamonds: 5,
      message: '🎰 JACKPOT! 🎰'
    })
  }
]

/**
 * Calculate XP based on difficulty
 */
export function calculateXP(difficulty, isPerfect = false) {
  const baseXP = {
    easy: 50,
    medium: 100,
    hard: 200
  }[difficulty] || 50

  return isPerfect ? Math.floor(baseXP * 1.5) : baseXP
}

/**
 * Calculate coin multiplier based on conditions
 */
export function calculateCoinMultiplier(isPerfect, difficulty) {
  let multiplier = 1

  if (isPerfect) {
    multiplier *= 1.5
  }

  if (difficulty === 'hard') {
    multiplier *= 2
  }

  return multiplier
}

/**
 * Calculate rewards for completing a model
 */
export function calculateRewards(modelData, mistakes, timeTaken) {
  const isPerfect = mistakes === 0
  const difficulty = modelData.difficulty || 'easy'

  // Calculate XP
  const xp = calculateXP(difficulty, isPerfect)

  // Roll for random loot
  const lootItem = COMPLETION_LOOT_TABLE
    .slice()
    .sort((a, b) => Math.random() - 0.5)
    .reduce((selected, item) => {
      if (!selected || Math.random() * 100 < item.weight) {
        return item
      }
      return selected
    })

  const loot = lootItem.getReward()

  // Apply multipliers to coins
  const coinMultiplier = calculateCoinMultiplier(isPerfect, difficulty)

  if (loot.type === 'coins') {
    loot.amount = Math.floor(loot.amount * coinMultiplier)
  } else if (loot.type === 'jackpot') {
    loot.coins = Math.floor(loot.coins * coinMultiplier)
  }

  // Apply multiplier to diamond rewards for hard difficulty
  if (difficulty === 'hard' && (loot.type === 'diamonds' || loot.type === 'jackpot')) {
    if (loot.type === 'diamonds') {
      loot.amount = Math.floor(loot.amount * 1.5)
    } else if (loot.type === 'jackpot') {
      loot.diamonds = Math.floor(loot.diamonds * 1.5)
    }
  }

  return {
    xp,
    loot,
    isPerfect,
    difficulty,
    coinMultiplier,
    timeTaken
  }
}
