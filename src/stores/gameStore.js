import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // Current model data
  currentModel: null,

  // Painted blocks: { "x,y,z": colorId }
  paintedBlocks: {},

  // Currently selected color ID
  selectedColorId: null,

  // Completion state
  isComplete: false,

  // Mistakes counter
  mistakes: 0,

  // Start time
  startTime: null,

  // Actions
  setCurrentModel: (model) => set({
    currentModel: model,
    paintedBlocks: {},
    selectedColorId: null,
    isComplete: false,
    mistakes: 0,
    startTime: Date.now()
  }),

  setSelectedColor: (colorId) => set({ selectedColorId: colorId }),

  paintBlock: (position, paintedColorId) => {
    const state = get()
    const posKey = `${position[0]},${position[1]},${position[2]}`

    // Find the block in the model
    const block = state.currentModel.blocks.find(
      b => b.x === position[0] && b.y === position[1] && b.z === position[2]
    )

    if (!block) return false

    // Check if color is correct
    if (block.colorId !== paintedColorId) {
      // Wrong color - increment mistakes
      set({ mistakes: state.mistakes + 1 })
      return false
    }

    // Correct color - paint the block
    const newPaintedBlocks = {
      ...state.paintedBlocks,
      [posKey]: paintedColorId
    }

    set({ paintedBlocks: newPaintedBlocks })

    // Check for completion
    const totalBlocks = state.currentModel.blocks.length
    const paintedCount = Object.keys(newPaintedBlocks).length

    if (paintedCount === totalBlocks) {
      set({ isComplete: true })
    }

    return true
  },

  resetGame: () => set({
    paintedBlocks: {},
    selectedColorId: null,
    isComplete: false,
    mistakes: 0,
    startTime: Date.now()
  })
}))
