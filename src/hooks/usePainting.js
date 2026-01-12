import { useGameStore } from '../stores/gameStore'

export function usePainting() {
  const { currentModel, paintedBlocks, paintBlock, paintBlocks, activeBrush } = useGameStore()

  const handlePaint = (clickedPosition, selectedColorId) => {
    if (!currentModel || !selectedColorId) return false

    const clickedBlock = currentModel.blocks.find(
      b => b.x === clickedPosition[0] && b.y === clickedPosition[1] && b.z === clickedPosition[2]
    )

    if (!clickedBlock) return false

    // Apply brush effect based on active brush type
    switch (activeBrush) {
      case 'basic':
        return paintBlock(clickedPosition, selectedColorId)

      case 'multi-fill':
        return applyMultiFill(clickedBlock, selectedColorId)

      case 'area':
        return applyAreaBrush(clickedPosition, selectedColorId)

      case 'x-ray':
        // X-ray is just a visual mode, still paint single blocks
        return paintBlock(clickedPosition, selectedColorId)

      case 'golden':
      case 'rainbow':
        // Cosmetic brushes work like basic but with visual effects
        return paintBlock(clickedPosition, selectedColorId)

      default:
        return paintBlock(clickedPosition, selectedColorId)
    }
  }

  // Multi-Fill: Paint all unpainted blocks with the same colorId as the clicked block
  const applyMultiFill = (clickedBlock, selectedColorId) => {
    const targetColorId = clickedBlock.colorId

    // Find all unpainted blocks with the same target colorId
    const blocksToFill = currentModel.blocks.filter(block => {
      const posKey = `${block.x},${block.y},${block.z}`
      return block.colorId === targetColorId && !paintedBlocks[posKey]
    })

    if (blocksToFill.length === 0) return false

    // Paint all matching blocks
    const blocksToPaint = blocksToFill.map(block => ({
      position: [block.x, block.y, block.z],
      colorId: selectedColorId
    }))

    return paintBlocks(blocksToPaint)
  }

  // Area Brush: Paint a 3x3x3 cube around the clicked block (only matching colors)
  const applyAreaBrush = (clickedPosition, selectedColorId) => {
    const [cx, cy, cz] = clickedPosition

    // Find the clicked block's required color
    const clickedBlock = currentModel.blocks.find(
      b => b.x === cx && b.y === cy && b.z === cz
    )

    if (!clickedBlock) return false

    const targetColorId = clickedBlock.colorId

    // Find all blocks in 3x3x3 area with the same required color
    const blocksInArea = []

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const x = cx + dx
          const y = cy + dy
          const z = cz + dz

          const posKey = `${x},${y},${z}`

          // Find block at this position
          const block = currentModel.blocks.find(
            b => b.x === x && b.y === y && b.z === z
          )

          // Only paint blocks that exist, match the target color, and aren't painted
          if (block && block.colorId === targetColorId && !paintedBlocks[posKey]) {
            blocksInArea.push({
              position: [x, y, z],
              colorId: selectedColorId
            })
          }
        }
      }
    }

    if (blocksInArea.length === 0) return false

    return paintBlocks(blocksInArea)
  }

  return {
    handlePaint
  }
}
