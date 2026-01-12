import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 100, spread = 10 }) {
  const particlesRef = useRef()
  const time = useRef(0)

  // Generate random particle positions and velocities
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = Math.random() * spread - spread / 2
      const y = Math.random() * spread - spread / 2
      const z = Math.random() * spread - spread / 2

      temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 })
    }
    return temp
  }, [count, spread])

  // Animate particles
  useFrame(() => {
    if (!particlesRef.current) return

    time.current += 0.01

    particles.forEach((particle, i) => {
      const { t, factor, speed, x, y, z } = particle

      // Update particle lifecycle
      particle.t = particle.t + speed

      // Get position from geometry
      const a = Math.cos(particle.t) + Math.sin(particle.t * 1) / 10
      const b = Math.sin(particle.t) + Math.cos(particle.t * 2) / 10
      const s = Math.cos(t)

      particlesRef.current.geometry.attributes.position.array[i * 3] = x + Math.cos((particle.t / 10) * factor) + (Math.sin(particle.t * 1) * factor) / 10
      particlesRef.current.geometry.attributes.position.array[i * 3 + 1] = y + Math.sin((particle.t / 10) * factor) + (Math.cos(particle.t * 2) * factor) / 10
      particlesRef.current.geometry.attributes.position.array[i * 3 + 2] = z + Math.cos((particle.t / 10) * factor) + (Math.sin(particle.t * 3) * factor) / 10
    })

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  // Create buffer geometry for particles
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    particles.forEach((p, i) => {
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
    })
    return positions
  }, [particles, count])

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ffd700"
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  )
}
