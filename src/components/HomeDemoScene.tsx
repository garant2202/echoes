'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Компонент обертової фотографії
function RotatingPhoto() {
  const mesh = useRef<THREE.Mesh>(null)
  const texture = useTexture('/demo-photo.jpg')

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.003
    }
  })

  return (
    <mesh ref={mesh} position={[0, 0.5, -1]}>
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Компонент частинок для створення ефекту "відлуння"
function EchoParticles() {
  const particles = useRef<THREE.Points>(null)

  // Створення геометрії частинок
  const particlesCount = 1000
  const positionArray = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3
    positionArray[i3] = (Math.random() - 0.5) * 10
    positionArray[i3 + 1] = (Math.random() - 0.5) * 10
    positionArray[i3 + 2] = (Math.random() - 0.5) * 10
  }

  useFrame(({ clock }) => {
    if (particles.current) {
      particles.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positionArray}
          count={particlesCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4776e6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Основний компонент сцени
export default function HomeDemoScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="sunset" />
        
        <RotatingPhoto />
        <EchoParticles />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
