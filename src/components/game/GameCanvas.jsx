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

      {/* Controls - touch enabled with pinch-to-zoom */}
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        target={[0, 5, 0]}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        touches={{
          ONE: 2,  // ROTATE - one finger drag to rotate
          TWO: 1   // DOLLY (zoom) - two finger pinch to zoom
        }}
      />

      {/* Game content */}
      {children}
    </Canvas>
  )
}

export default GameCanvas
