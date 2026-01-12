// Shop items available for purchase

export const BRUSHES = [
  {
    id: 'basic',
    name: 'Basic Brush',
    description: 'Your trusty starter brush',
    effect: 'Paint one block at a time',
    cost: { type: 'coins', amount: 0 },
    unlocked: true, // Free and always available
    cosmetic: false,
  },
  {
    id: 'multi-fill',
    name: 'Multi-Fill Brush',
    description: 'Why click 20 times when once will do?',
    effect: 'Paint all unpainted blocks of the same number',
    cost: { type: 'coins', amount: 50 },
    unlocked: false,
    requiredLevel: 3,
    cosmetic: false,
  },
  {
    id: 'area',
    name: 'Area Brush',
    description: 'For those big flat sections',
    effect: 'Paint a 3x3x3 area (same color only)',
    cost: { type: 'coins', amount: 75 },
    unlocked: false,
    requiredLevel: 1,
    cosmetic: false,
  },
  {
    id: 'x-ray',
    name: 'X-Ray Brush',
    description: 'Find those sneaky hidden blocks',
    effect: 'See through outer blocks to find inner ones',
    cost: { type: 'coins', amount: 100 },
    unlocked: false,
    requiredLevel: 1,
    cosmetic: false,
  },
  {
    id: 'golden',
    name: 'Golden Brush',
    description: 'Fancy!',
    effect: 'Leaves a sparkle trail when painting (cosmetic)',
    cost: { type: 'diamonds', amount: 20 },
    unlocked: false,
    requiredLevel: 5,
    cosmetic: true,
  },
  {
    id: 'rainbow',
    name: 'Rainbow Brush',
    description: 'Ooh, pretty!',
    effect: 'Animated color trail when painting (cosmetic)',
    cost: { type: 'diamonds', amount: 35 },
    unlocked: false,
    requiredLevel: 7,
    cosmetic: true,
  },
]

export const UTILITIES = [
  {
    id: 'undo-pack',
    name: 'Undo Pack (x3)',
    description: 'Fix 3 mistakes',
    effect: 'Adds 3 undo uses to your inventory',
    cost: { type: 'coins', amount: 10 },
    consumable: true,
    stackable: true,
  },
  {
    id: 'hint-pack',
    name: 'Hint Pack (x3)',
    description: 'Reveals 3 random unpainted blocks',
    effect: 'Adds 3 hint uses to your inventory',
    cost: { type: 'coins', amount: 15 },
    consumable: true,
    stackable: true,
  },
]

// Helper functions
export function getBrushById(brushId) {
  return BRUSHES.find(b => b.id === brushId)
}

export function getUtilityById(utilityId) {
  return UTILITIES.find(u => u.id === utilityId)
}

export function canAfford(item, coins, diamonds) {
  if (item.cost.type === 'coins') {
    return coins >= item.cost.amount
  } else if (item.cost.type === 'diamonds') {
    return diamonds >= item.cost.amount
  }
  return false
}

export function canUnlock(item, level) {
  if (!item.requiredLevel) return true
  return level >= item.requiredLevel
}
