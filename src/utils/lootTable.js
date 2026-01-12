/**
 * Weighted random selection from a loot table
 */
export function rollLoot(lootTable) {
  const totalWeight = lootTable.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight

  for (const item of lootTable) {
    random -= item.weight
    if (random <= 0) {
      return item
    }
  }

  // Fallback (should never happen)
  return lootTable[0]
}

/**
 * Roll multiple items from a loot table
 */
export function rollMultipleLoot(lootTable, count) {
  const results = []
  for (let i = 0; i < count; i++) {
    results.push(rollLoot(lootTable))
  }
  return results
}

/**
 * Generate a random amount within a range
 */
export function randomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
