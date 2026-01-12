import PaintableBlock from './PaintableBlock'
import { getColorById } from '../../data/colors'

function VoxelModel({ modelData, paintedBlocks, onBlockClick, xRayMode = false, hintBlock = null }) {
  return (
    <group>
      {modelData.blocks.map((block, index) => {
        const posKey = `${block.x},${block.y},${block.z}`
        const isPainted = paintedBlocks.hasOwnProperty(posKey)
        const paintedColorId = paintedBlocks[posKey]
        const paintedColor = isPainted ? getColorById(paintedColorId)?.hex : null

        // Check if this is the hint block
        const isHint = hintBlock &&
          hintBlock[0] === block.x &&
          hintBlock[1] === block.y &&
          hintBlock[2] === block.z

        return (
          <PaintableBlock
            key={index}
            position={[block.x, block.y, block.z]}
            colorId={block.colorId}
            number={getColorById(block.colorId)?.number}
            isPainted={isPainted}
            paintedColor={paintedColor}
            onClick={onBlockClick}
            xRayMode={xRayMode}
            isHint={isHint}
          />
        )
      })}
    </group>
  )
}

export default VoxelModel
