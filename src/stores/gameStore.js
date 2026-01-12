import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // UI Phase - menu, modelSelect, playing, shop, settings
  phase: 'menu',

  // Current model data
  currentModel: null,

  // Painted blocks: { "x,y,z": colorId }
  paintedBlocks: {},

  // Currently selected color ID
  selectedColorId: null,

  // Active brush
  activeBrush: 'basic',

  // X-Ray mode (see through blocks)
  xRayMode: false,

  // Hint - highlighted block position
  hintBlock: null,

  // Undo history - array of painted block states
  undoHistory: [],

  // Completion state
  isComplete: false,

  // Mistakes counter
  mistakes: 0,

  // Start time
  startTime: null,

  // Actions
  setPhase: (phase) => set({ phase }),

  setCurrentModel: (model) => set({
    currentModel: model,
    paintedBlocks: {},
    selectedColorId: null,
    isComplete: false,
    mistakes: 0,
    startTime: Date.now(),
    undoHistory: [],
    hintBlock: null
  }),

  setSelectedColor: (colorId) => set({ selectedColorId: colorId }),

  setActiveBrush: (brushId) => set({ activeBrush: brushId }),

  toggleXRayMode: () => set((state) => ({ xRayMode: !state.xRayMode })),

  showHint: () => {
    const state = get()
    if (!state.currentModel) return null

    // Find all unpainted blocks
    const unpaintedBlocks = state.currentModel.blocks.filter(block => {
      const posKey = `${block.x},${block.y},${block.z}`
      return !state.paintedBlocks[posKey]
    })

    if (unpaintedBlocks.length === 0) return null

    // Pick a random unpainted block
    const randomBlock = unpaintedBlocks[Math.floor(Math.random() * unpaintedBlocks.length)]
    const hintPosition = [randomBlock.x, randomBlock.y, randomBlock.z]

    set({ hintBlock: hintPosition })

    // Clear hint after 3 seconds
    setTimeout(() => {
      set({ hintBlock: null })
    }, 3000)

    return hintPosition
  },

  undo: () => {
    const state = get()
    if (state.undoHistory.length === 0) return false

    // Get the last state from history
    const previousState = state.undoHistory[state.undoHistory.length - 1]
    const newHistory = state.undoHistory.slice(0, -1)

    set({
      paintedBlocks: previousState,
      undoHistory: newHistory,
      isComplete: false
    })

    return true
  },

  paintBlock: (position, paintedColorId) => {
    const state = get()
    const posKey = `${position[0]},${position[1]},${position[2]}`

    // Find the block in the model
    const block = state.currentModel.blocks.find(
      b => b.x === position[0] && b.y === position[1] && b.z === position[2]
    )

    if (!block) return false

    // Check if already painted
    if (state.paintedBlocks[posKey]) return false

    // Check if color is correct
    if (block.colorId !== paintedColorId) {
      // Wrong color - increment mistakes
      set({ mistakes: state.mistakes + 1 })
      return false
    }

    // Save current state to undo history (limit to last 10 states)
    const newUndoHistory = [...state.undoHistory, { ...state.paintedBlocks }]
    if (newUndoHistory.length > 10) {
      newUndoHistory.shift()
    }

    // Correct color - paint the block
    const newPaintedBlocks = {
      ...state.paintedBlocks,
      [posKey]: paintedColorId
    }

    set({
      paintedBlocks: newPaintedBlocks,
      undoHistory: newUndoHistory
    })

    // Check for completion
    const totalBlocks = state.currentModel.blocks.length
    const paintedCount = Object.keys(newPaintedBlocks).length

    if (paintedCount === totalBlocks) {
      set({ isComplete: true })
    }

    return true
  },

  // Paint multiple blocks at once (for brush effects)
  paintBlocks: (blocks) => {
    const state = get()

    // Save current state to undo history
    const newUndoHistory = [...state.undoHistory, { ...state.paintedBlocks }]
    if (newUndoHistory.length > 10) {
      newUndoHistory.shift()
    }

    let newPaintedBlocks = { ...state.paintedBlocks }
    let mistakesMade = 0
    let blocksPainted = 0

    blocks.forEach(({ position, colorId }) => {
      const posKey = `${position[0]},${position[1]},${position[2]}`

      // Skip if already painted
      if (newPaintedBlocks[posKey]) return

      // Find the block in the model
      const block = state.currentModel.blocks.find(
        b => b.x === position[0] && b.y === position[1] && b.z === position[2]
      )

      if (!block) return

      // Check if color is correct
      if (block.colorId !== colorId) {
        mistakesMade++
        return
      }

      // Paint the block
      newPaintedBlocks[posKey] = colorId
      blocksPainted++
    })

    if (blocksPainted === 0) {
      // No blocks were painted, don't update state
      return { success: false, painted: 0, mistakes: mistakesMade }
    }

    set({
      paintedBlocks: newPaintedBlocks,
      undoHistory: newUndoHistory,
      mistakes: state.mistakes + mistakesMade
    })

    // Check for completion
    const totalBlocks = state.currentModel.blocks.length
    const paintedCount = Object.keys(newPaintedBlocks).length

    if (paintedCount === totalBlocks) {
      set({ isComplete: true })
    }

    return { success: true, painted: blocksPainted, mistakes: mistakesMade }
  },

  resetGame: () => set({
    paintedBlocks: {},
    selectedColorId: null,
    isComplete: false,
    mistakes: 0,
    startTime: Date.now(),
    undoHistory: [],
    hintBlock: null
  })
}))
