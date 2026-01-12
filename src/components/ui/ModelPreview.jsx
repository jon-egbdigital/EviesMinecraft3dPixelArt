import { Canvas } from '@react-three/fiber'
import { getColorById } from '../../data/colors'

function ModelPreview({ modelData }) {
  if (!modelData || !modelData.blocks) {
    return (
      <div className="aspect-square bg-stone-800 flex items-center justify-center">
        <span className="text-6xl">🎨</span>
      </div>
    )
  }

  // Calculate model center for camera positioning
  const bounds = modelData.blocks.reduce(
    (acc, block) => ({
      minX: Math.min(acc.minX, block.x),
      maxX: Math.max(acc.maxX, block.x),
      minY: Math.min(acc.minY, block.y),
      maxY: Math.max(acc.maxY, block.y),
      minZ: Math.min(acc.minZ, block.z),
      maxZ: Math.max(acc.maxZ, block.z)
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity }
  )

  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const centerZ = (bounds.minZ + bounds.maxZ) / 2

  const sizeX = bounds.maxX - bounds.minX
  const sizeY = bounds.maxY - bounds.minY
  const sizeZ = bounds.maxZ - bounds.minZ
  const maxSize = Math.max(sizeX, sizeY, sizeZ)

  const cameraDistance = maxSize * 2 + 5

  return (
    <div className="aspect-square bg-stone-900">
      <Canvas
        camera={{
          position: [
            centerX + cameraDistance * 0.7,
            centerY + cameraDistance * 0.7,
            centerZ + cameraDistance * 0.7
          ],
          fov: 50
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <group>
          {modelData.blocks.map((block, index) => {
            const color = getColorById(block.colorId)?.hex || '#808080'

            return (
              <mesh key={index} position={[block.x, block.y, block.z]}>
                <boxGeometry args={[0.95, 0.95, 0.95]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.1}
                  roughness={0.8}
                />
              </mesh>
            )
          })}
        </group>
      </Canvas>
    </div>
  )
}

export default ModelPreview
