import { useRef } from 'react'
import type { RefObject } from 'react'
import { Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { applyHeroMotion } from './heroMotion'

interface OceanSceneProps {
  scrollProgressRef: RefObject<number>
  reducedMotion?: boolean
  lowPower?: boolean
  isLight?: boolean
}

const AQUA_PEARLS = [
  { orbitRadius: 2.3, yOffset: 0.72, speed: 0.5, phase: 0.2, radius: 0.2, tint: '#7dd3fc' },
  { orbitRadius: 2.0, yOffset: -0.68, speed: -0.44, phase: 2.1, radius: 0.16, tint: '#5eead4' },
  { orbitRadius: 1.85, yOffset: 0.96, speed: 0.38, phase: 3.8, radius: 0.13, tint: '#bae6fd' },
  { orbitRadius: 2.15, yOffset: -0.92, speed: -0.35, phase: 5.2, radius: 0.15, tint: '#99f6e4' },
]

export function OceanScene({
  scrollProgressRef,
  reducedMotion = false,
  lowPower = false,
  isLight = false,
}: OceanSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const shellRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const pearlRefs = useRef<Array<THREE.Mesh | null>>([])
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

    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.28
      shellRef.current.rotation.x += delta * 0.11
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(elapsed * 1.8) * 0.06
      coreRef.current.scale.setScalar(pulse)
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.22
      outerRingRef.current.rotation.x += delta * 0.09
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.3
      innerRingRef.current.rotation.y -= delta * 0.15
    }

    AQUA_PEARLS.forEach((pearl, index) => {
      const mesh = pearlRefs.current[index]
      if (!mesh) return
      const theta = elapsed * pearl.speed + pearl.phase
      mesh.position.x = Math.cos(theta) * pearl.orbitRadius
      mesh.position.z = Math.sin(theta) * (pearl.orbitRadius * 0.65)
      mesh.position.y = pearl.yOffset + Math.sin(elapsed * 1.15 + pearl.phase) * 0.2
    })
  })

  return (
    <group ref={groupRef} position={[baseX, baseY, 0]} scale={baseScale}>
      <Float
        speed={reducedMotion ? 0 : 1.65}
        rotationIntensity={reducedMotion ? 0 : 0.28}
        floatIntensity={reducedMotion ? 0 : 0.45}
      >
        {/* Bioluminescent Aqua Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.42, 28, 28]} />
          <meshBasicMaterial
            color={isLight ? '#0ea5e9' : '#2dd4bf'}
            transparent
            opacity={isLight ? 0.22 : 0.3}
            blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Sculpted Liquid-Aqua Wave Torus Centerpiece */}
        <mesh ref={shellRef}>
          <torusGeometry args={[0.96, 0.34, lowPower ? 24 : 40, lowPower ? 72 : 120]} />
          <meshPhysicalMaterial
            color={isLight ? '#bae6fd' : '#e0f2fe'}
            roughness={0.07}
            metalness={isLight ? 0.1 : 0.06}
            transmission={lowPower ? 0.62 : 0.92}
            thickness={1.5}
            ior={1.47}
            iridescence={0.85}
            iridescenceIOR={1.34}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationColor={isLight ? '#0284c7' : '#38bdf8'}
            attenuationDistance={2.0}
            transparent
            opacity={0.94}
          />
        </mesh>

        {/* Outer Tidal Current Ring */}
        <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0.25, 0]}>
          <torusGeometry args={[1.88, 0.044, 22, 110]} />
          <meshPhysicalMaterial
            color={isLight ? '#0284c7' : '#7dd3fc'}
            roughness={0.12}
            metalness={0.24}
            iridescence={0.7}
            clearcoat={1}
            transparent
            opacity={isLight ? 0.56 : 0.72}
          />
        </mesh>

        {/* Inner Seafoam Turquoise Ring */}
        <mesh ref={innerRingRef} rotation={[-Math.PI / 4, 0.55, 0.35]}>
          <torusGeometry args={[1.56, 0.032, 18, 96]} />
          <meshPhysicalMaterial
            color={isLight ? '#0d9488' : '#2dd4bf'}
            roughness={0.14}
            metalness={0.2}
            iridescence={0.6}
            clearcoat={1}
            transparent
            opacity={isLight ? 0.46 : 0.6}
          />
        </mesh>

        {/* Orbiting Glass Bubble Pearls */}
        {AQUA_PEARLS.map((pearl, index) => (
          <mesh
            key={index}
            ref={(el) => {
              pearlRefs.current[index] = el
            }}
            position={[
              Math.cos(pearl.phase) * pearl.orbitRadius,
              pearl.yOffset,
              Math.sin(pearl.phase) * (pearl.orbitRadius * 0.65),
            ]}
          >
            <sphereGeometry args={[pearl.radius, 22, 22]} />
            <meshPhysicalMaterial
              color={pearl.tint}
              roughness={0.07}
              metalness={0.06}
              transmission={lowPower ? 0.55 : 0.88}
              thickness={0.85}
              ior={1.45}
              iridescence={0.6}
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
