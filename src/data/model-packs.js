// Model packs that can be unlocked with diamonds or level progression

export const MODEL_PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    description: 'Free beginner models to get you started',
    models: ['sword', 'apple', 'diamond', 'stick'],
    cost: null, // Free
    requiredLevel: 1,
    unlocked: true,
  },
  {
    id: 'tools',
    name: 'Tool Pack',
    description: 'Essential Minecraft tools',
    models: ['pickaxe', 'axe'],
    cost: { type: 'diamonds', amount: 3 },
    requiredLevel: 1,
    unlocked: false,
  },
  {
    id: 'weapons',
    name: 'Weapon Pack',
    description: 'Arm yourself for adventure',
    models: ['bow', 'trident', 'shield'],
    cost: { type: 'diamonds', amount: 5 },
    requiredLevel: 2,
    unlocked: false,
  },
  {
    id: 'animals',
    name: 'Animal Pack',
    description: 'Friendly creatures from the Overworld',
    models: ['chicken', 'rabbit', 'fish'],
    cost: { type: 'diamonds', amount: 5 },
    requiredLevel: 2,
    unlocked: false,
  },
  {
    id: 'armor',
    name: 'Armor Pack',
    description: 'Protection for your adventures',
    models: ['helmet'],
    cost: { type: 'diamonds', amount: 4 },
    requiredLevel: 3,
    unlocked: false,
  },
]

// Helper functions
export function getPackById(packId) {
  return MODEL_PACKS.find(p => p.id === packId)
}

export function getUnlockedPacks(unlockedPackIds) {
  return MODEL_PACKS.filter(pack =>
    pack.unlocked || unlockedPackIds.includes(pack.id)
  )
}

export function getLockedPacks(unlockedPackIds, playerLevel) {
  return MODEL_PACKS.filter(pack =>
    !pack.unlocked &&
    !unlockedPackIds.includes(pack.id) &&
    playerLevel >= pack.requiredLevel
  )
}

export function canAffordPack(pack, coins, diamonds) {
  if (!pack.cost) return true

  if (pack.cost.type === 'coins') {
    return coins >= pack.cost.amount
  } else if (pack.cost.type === 'diamonds') {
    return diamonds >= pack.cost.amount
  }

  return false
}

export function canUnlockPack(pack, playerLevel) {
  return playerLevel >= pack.requiredLevel
}

export function getModelsInPack(packId) {
  const pack = getPackById(packId)
  return pack ? pack.models : []
}
