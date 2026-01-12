import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BrushTrail({ position, type = 'golden', active = false }) {
  const trailRef = useRef()
  const time = useRef(0)

  // Determine trail color based on brush type
  const colors = useMemo(() => {
    if (type === 'golden') {
      return ['#ffd700', '#ffed4e', '#ffa500']
    } else if (type === 'rainbow') {
      return ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
    }
    return ['#ffffff']
  }, [type])

  // Animate trail
  useFrame((state, delta) => {
    if (!trailRef.current || !active) return

    time.current += delta

    // Pulse effect
    const scale = 1 + Math.sin(time.current * 5) * 0.2
    trailRef.current.scale.set(scale, scale, scale)

    // Rotation for rainbow
    if (type === 'rainbow') {
      trailRef.current.rotation.y += delta * 2
    }
  })

  if (!active || !position) return null

  return (
    <group ref={trailRef} position={position}>
      {/* Sparkle particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 0.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color={colors[i % colors.length]}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}

      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={colors[0]}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}
