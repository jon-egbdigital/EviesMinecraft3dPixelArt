import { useState, useRef } from 'react'
import { Text } from '@react-three/drei'
import { UNPAINTED_COLOR, ERROR_COLOR } from '../../data/colors'

function PaintableBlock({ position, colorId, number, isPainted, paintedColor, onClick }) {
  const [isError, setIsError] = useState(false)
  const meshRef = useRef()

  // Determine block color
  const blockColor = isPainted ? paintedColor : UNPAINTED_COLOR

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
        />
      </mesh>

      {/* Number label - only show if not painted */}
      {!isPainted && (
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
      )}
    </group>
  )
}

export default PaintableBlock
