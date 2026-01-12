import { useState, useRef } from 'react'
import { Text } from '@react-three/drei'
import { UNPAINTED_COLOR, ERROR_COLOR } from '../../data/colors'

function PaintableBlock({ position, colorId, number, isPainted, paintedColor, onClick, xRayMode = false, isHint = false }) {
  const [isError, setIsError] = useState(false)
  const meshRef = useRef()

  // Determine block color
  const blockColor = isPainted ? paintedColor : UNPAINTED_COLOR

  // X-Ray mode: make painted blocks semi-transparent
  const opacity = xRayMode && isPainted ? 0.3 : 1.0
  const transparent = xRayMode && isPainted

  const handleClick = (e) => {
    e.stopPropagation()
    const success = onClick(position, colorId)

    if (!success) {
      // Flash red on wrong color
      setIsError(true)
      setTimeout(() => setIsError(false), 300)
    }
  }

  return (
    <group position={position}>
      {/* The cube */}
      <mesh ref={meshRef} onClick={handleClick}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial
          color={isError ? ERROR_COLOR : blockColor}
          metalness={0.1}
          roughness={0.8}
          opacity={opacity}
          transparent={transparent}
          emissive={isHint ? '#ffaa00' : '#000000'}
          emissiveIntensity={isHint ? 0.5 : 0}
        />
      </mesh>

      {/* Number labels on all 6 sides - only show if not painted */}
      {!isPainted && (
        <>
          {/* Front face */}
          <Text
            position={[0, 0, 0.5]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {number}
          </Text>

          {/* Back face */}
          <Text
            position={[0, 0, -0.5]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {number}
          </Text>

          {/* Right face */}
          <Text
            position={[0.5, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {number}
          </Text>

          {/* Left face */}
          <Text
            position={[-0.5, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {number}
          </Text>

          {/* Top face */}
          <Text
            position={[0, 0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {number}
          </Text>

          {/* Bottom face */}
          <Text
            position={[0, -0.5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {number}
          </Text>
        </>
      )}
    </group>
  )
}

export default PaintableBlock
