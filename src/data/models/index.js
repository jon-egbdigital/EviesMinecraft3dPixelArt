// Model registry - imports all model JSON files and provides access functions

// Import all models from the root models/ directory
// Note: Update this list as new models are added
const MODEL_FILES = [
  'apple',
  'axe',
  'bow',
  'chicken',
  'diamond',
  'fish',
  'helmet',
  'pickaxe',
  'rabbit',
  'shield',
  'stick',
  'sword',
  'trident',
]

// Dynamically load all models
let modelsCache = null

async function loadAllModels() {
  if (modelsCache) return modelsCache

  const models = {}

  for (const modelId of MODEL_FILES) {
    try {
      const response = await fetch(`/models/${modelId}.json`)
      const modelData = await response.json()
      models[modelId] = modelData
    } catch (error) {
      console.error(`Failed to load model: ${modelId}`, error)
    }
  }

  modelsCache = models
  return models
}

// Get all models
export async function getAllModels() {
  const models = await loadAllModels()
  return Object.values(models)
}

// Get model by ID
export async function getModelById(modelId) {
  const models = await loadAllModels()
  return models[modelId] || null
}

// Get models by pack name
export async function getModelsByPack(packName) {
  const allModels = await getAllModels()
  return allModels.filter(model => model.pack === packName || (!model.pack && packName === 'starter'))
}

// Get models by difficulty
export async function getModelsByDifficulty(difficulty) {
  const allModels = await getAllModels()
  return allModels.filter(model => model.difficulty === difficulty)
}

// Get unlocked models based on player's unlocked list
export async function getUnlockedModels(unlockedModelIds) {
  const allModels = await getAllModels()
  return allModels.filter(model =>
    !model.unlockCost || unlockedModelIds.includes(model.id)
  )
}

// Get locked models that can be purchased
export async function getLockedModels(unlockedModelIds) {
  const allModels = await getAllModels()
  return allModels.filter(model =>
    model.unlockCost && !unlockedModelIds.includes(model.id)
  )
}

// Check if a model is unlocked
export function isModelUnlocked(modelId, unlockedModelIds) {
  return unlockedModelIds.includes(modelId)
}

// Get starter pack models (free models)
export async function getStarterModels() {
  const allModels = await getAllModels()
  return allModels.filter(model => !model.unlockCost)
}
