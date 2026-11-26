import { useRef } from 'react'
import type { RefObject } from 'react'
import { Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { applyHeroMotion } from './heroMotion'

interface JungleSceneProps {
  scrollProgressRef: RefObject<number>
  reducedMotion?: boolean
  lowPower?: boolean
  isLight?: boolean
}

const DEWDROP_NODES = [
  { orbitRadius: 2.25, yOffset: 0.65, speed: 0.52, phase: 0.3, radius: 0.2, tint: '#6ee7b7' },
  { orbitRadius: 2.05, yOffset: -0.65, speed: -0.44, phase: 1.9, radius: 0.16, tint: '#7dd3fc' },
  { orbitRadius: 1.85, yOffset: 0.95, speed: 0.38, phase: 3.6, radius: 0.14, tint: '#a7f3d0' },
  { orbitRadius: 2.15, yOffset: -0.9, speed: -0.35, phase: 5.0, radius: 0.15, tint: '#5eead4' },
  { orbitRadius: 1.65, yOffset: 0.2, speed: 0.58, phase: 2.7, radius: 0.11, tint: '#bae6fd' },
]

export function JungleScene({
  scrollProgressRef,
  reducedMotion = false,
  lowPower = false,
  isLight = false,
}: JungleSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const prismRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const outerHaloRef = useRef<THREE.Mesh>(null)
  const innerHaloRef = useRef<THREE.Mesh>(null)
  const dropRefs = useRef<Array<THREE.Mesh | null>>([])
  const { viewport } = useThree()

  const isWide = viewport.width >= 8.5
  const baseX = isWide ? 1.85 : 0
  const baseY = isWide ? 0.05 : 0.7
  const baseScale = isWide ? 1 : viewport.width < 5.5 ? 0.66 : 0.82

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const scroll = scrollProgressRef.current ?? 0
    const elapsed = state.clock.elapsedTime
    applyHeroMotion(groupRef.current, {
      baseX,
      baseY,
      isWide,
      scroll,
      elapsed,
      pointer: state.pointer,
      reducedMotion,
    })

    if (reducedMotion) return

    if (prismRef.current) {
      prismRef.current.rotation.y += delta * 0.3
      prismRef.current.rotation.z += delta * 0.09
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(elapsed * 1.8) * 0.06
      coreRef.current.scale.setScalar(pulse)
    }
    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.z -= delta * 0.2
      outerHaloRef.current.rotation.x += delta * 0.09
    }
    if (innerHaloRef.current) {
      innerHaloRef.current.rotation.z += delta * 0.28
      innerHaloRef.current.rotation.y -= delta * 0.15
    }

    DEWDROP_NODES.forEach((drop, index) => {
      const mesh = dropRefs.current[index]
      if (!mesh) return
      const theta = elapsed * drop.speed + drop.phase
      mesh.position.x = Math.cos(theta) * drop.orbitRadius
      mesh.position.z = Math.sin(theta) * (drop.orbitRadius * 0.65)
      mesh.position.y = drop.yOffset + Math.sin(elapsed * 1.2 + drop.phase) * 0.22
    })
  })

  return (
    <group ref={groupRef} position={[baseX, baseY, 0]} scale={baseScale}>
      <Float
        speed={reducedMotion ? 0 : 1.65}
        rotationIntensity={reducedMotion ? 0 : 0.28}
        floatIntensity={reducedMotion ? 0 : 0.45}
      >
        {/* Soft Bioluminescent Emerald Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.42, 28, 28]} />
          <meshBasicMaterial
            color={isLight ? '#10b981' : '#6ee7b7'}
            transparent
            opacity={isLight ? 0.22 : 0.3}
            blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Botanical Liquid-Glass Emerald Crystal Centerpiece */}
        <mesh ref={prismRef} scale={[1.0, 1.38, 1.0]}>
          <octahedronGeometry args={[0.92, lowPower ? 1 : 2]} />
          <meshPhysicalMaterial
            color={isLight ? '#a7f3d0' : '#d1fae5'}
            roughness={0.08}
            metalness={isLight ? 0.1 : 0.05}
            transmission={lowPower ? 0.6 : 0.9}
            thickness={1.45}
            ior={1.46}
            iridescence={0.8}
            iridescenceIOR={1.34}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationColor={isLight ? '#059669' : '#34d399'}
            attenuationDistance={2.0}
            transparent
            opacity={0.94}
          />
        </mesh>

        {/* Outer Canopy Glass Ring */}
        <mesh ref={outerHaloRef} rotation={[Math.PI / 3, 0.28, 0]}>
          <torusGeometry args={[1.86, 0.042, 22, 110]} />
          <meshPhysicalMaterial
            color={isLight ? '#059669' : '#6ee7b7'}
            roughness={0.12}
            metalness={0.22}
            iridescence={0.65}
            clearcoat={1}
            transparent
            opacity={isLight ? 0.56 : 0.72}
          />
        </mesh>

        {/* Inner Rain-Teal Ring */}
        <mesh ref={innerHaloRef} rotation={[-Math.PI / 4.2, 0.55, 0.4]}>
          <torusGeometry args={[1.55, 0.03, 18, 96]} />
          <meshPhysicalMaterial
            color={isLight ? '#0d9488' : '#38bdf8'}
            roughness={0.14}
            metalness={0.2}
            iridescence={0.55}
            clearcoat={1}
            transparent
            opacity={isLight ? 0.45 : 0.58}
          />
        </mesh>

        {/* Orbiting Glass Raindrop Pearls */}
        {DEWDROP_NODES.map((drop, index) => (
          <mesh
            key={index}
            ref={(el) => {
              dropRefs.current[index] = el
            }}
            scale={[0.92, 1.18, 0.92]}
            position={[
              Math.cos(drop.phase) * drop.orbitRadius,
              drop.yOffset,
              Math.sin(drop.phase) * (drop.orbitRadius * 0.65),
            ]}
          >
            <sphereGeometry args={[drop.radius, 22, 22]} />
            <meshPhysicalMaterial
              color={drop.tint}
              roughness={0.07}
              metalness={0.05}
              transmission={lowPower ? 0.55 : 0.88}
              thickness={0.85}
              ior={1.45}
              iridescence={0.55}
              clearcoat={1}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </Float>
    </group>
  )
}
