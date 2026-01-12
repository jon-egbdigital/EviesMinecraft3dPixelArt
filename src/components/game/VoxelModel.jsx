import PaintableBlock from './PaintableBlock'
import { getColorById } from '../../data/colors'

function VoxelModel({ modelData, paintedBlocks, onBlockClick }) {
  return (
    <group>
      {modelData.blocks.map((block, index) => {
        const posKey = `${block.x},${block.y},${block.z}`
        const isPainted = paintedBlocks.hasOwnProperty(posKey)
        const paintedColorId = paintedBlocks[posKey]
        const paintedColor = isPainted ? getColorById(paintedColorId)?.hex : null

        return (
          <PaintableBlock
            key={index}
            position={[block.x, block.y, block.z]}
            colorId={block.colorId}
            number={getColorById(block.colorId)?.number}
            isPainted={isPainted}
            paintedColor={paintedColor}
            onClick={onBlockClick}
          />
        )
      })}
    </group>
  )
}

export default VoxelModel
