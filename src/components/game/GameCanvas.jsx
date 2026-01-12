import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function GameCanvas({ children }) {
  return (
    <Canvas
      camera={{ position: [8, 8, 8], fov: 50 }}
      style={{ background: '#1a1a1a' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        target={[0, 5, 0]}
      />

      {/* Game content */}
      {children}
    </Canvas>
  )
}

export default GameCanvas
