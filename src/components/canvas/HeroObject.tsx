import { useRef } from 'react'
import type { RefObject } from 'react'
import { Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface HeroObjectProps {
  scrollProgressRef: RefObject<number>
  reducedMotion?: boolean
  lowPower?: boolean
}

const ORBITING_GLASS_NODES: Array<{
  orbitRadius: number
  yOffset: number
  speed: number
  phase: number
  radius: number
  tint: string
}> = [
  { orbitRadius: 2.35, yOffset: 0.75, speed: 0.36, phase: 0.4, radius: 0.22, tint: '#bae6fd' },
  { orbitRadius: 2.2, yOffset: -0.7, speed: -0.3, phase: 2.2, radius: 0.18, tint: '#c7d2fe' },
  { orbitRadius: 2.0, yOffset: 1.05, speed: 0.26, phase: 3.9, radius: 0.14, tint: '#f9a8d4' },
  { orbitRadius: 2.1, yOffset: -0.95, speed: -0.24, phase: 5.1, radius: 0.15, tint: '#6ee7b7' },
]

export function HeroObject({
  scrollProgressRef,
  reducedMotion = false,
  lowPower = false,
}: HeroObjectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const knotRef = useRef<THREE.Mesh>(null)
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

    // Gently shift position & depth on scroll so the sculpture guides the eye down the page
    const targetX = baseX - scroll * (isWide ? 1.55 : 0)
    const targetY = baseY + scroll * 0.4
    const targetZ = -scroll * 1.5

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06)

    if (reducedMotion) return

    const elapsed = state.clock.elapsedTime

    const pointerRotX = -state.pointer.y * 0.24 + scroll * 0.5
    const pointerRotY = state.pointer.x * 0.34 + scroll * 0.9

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointerRotX, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointerRotY, 0.05)

    if (knotRef.current) {
      knotRef.current.rotation.y += delta * 0.14
      knotRef.current.rotation.x += delta * 0.07
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(elapsed * 1.8) * 0.06
      coreRef.current.scale.setScalar(pulse)
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.11
      outerRingRef.current.rotation.x += delta * 0.045
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.17
      innerRingRef.current.rotation.y -= delta * 0.085
    }

    // Smooth orbital motion for the 4 glass pearls
    ORBITING_GLASS_NODES.forEach((node, index) => {
      const mesh = pearlRefs.current[index]
      if (!mesh) return
      const theta = elapsed * node.speed + node.phase
      mesh.position.x = Math.cos(theta) * node.orbitRadius
      mesh.position.z = Math.sin(theta) * (node.orbitRadius * 0.65)
      mesh.position.y = node.yOffset + Math.sin(elapsed * 0.9 + node.phase) * 0.18
    })
  })

  return (
    <group ref={groupRef} position={[baseX, baseY, 0]} scale={baseScale}>
      <Float
        speed={reducedMotion ? 0 : 1.35}
        rotationIntensity={reducedMotion ? 0 : 0.22}
        floatIntensity={reducedMotion ? 0 : 0.42}
      >
        {/* Soft Luminous Inner Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.38, 28, 28]} />
          <meshBasicMaterial
            color="#a5b4fc"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Sculpted Apple Liquid Glass Torus-Knot Centerpiece */}
        <mesh ref={knotRef}>
          <torusKnotGeometry
            args={[0.98, 0.25, lowPower ? 96 : 168, lowPower ? 20 : 36, 2, 3]}
          />
          <meshPhysicalMaterial
            color="#e0f2fe"
            roughness={0.07}
            metalness={0.06}
            transmission={lowPower ? 0.65 : 0.92}
            thickness={1.5}
            ior={1.48}
            iridescence={0.85}
            iridescenceIOR={1.34}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationColor="#8ecae6"
            attenuationDistance={2.2}
            transparent
            opacity={0.94}
          />
        </mesh>

        {/* Outer Sleek Glass Gyro Ring */}
        <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0.25, 0]}>
          <torusGeometry args={[1.92, 0.045, 24, 120]} />
          <meshPhysicalMaterial
            color="#bae6fd"
            roughness={0.12}
            metalness={0.25}
            iridescence={0.65}
            clearcoat={1}
            transparent
            opacity={0.72}
          />
        </mesh>

        {/* Inner Tilted Orbital Ring */}
        <mesh ref={innerRingRef} rotation={[-Math.PI / 4, 0.6, 0.4]}>
          <torusGeometry args={[1.64, 0.032, 20, 100]} />
          <meshPhysicalMaterial
            color="#f9a8d4"
            roughness={0.14}
            metalness={0.2}
            iridescence={0.55}
            clearcoat={1}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Orbiting Glass Pearls */}
        {ORBITING_GLASS_NODES.map((node, index) => (
          <mesh
            key={index}
            ref={(el) => {
              pearlRefs.current[index] = el
            }}
            position={[
              Math.cos(node.phase) * node.orbitRadius,
              node.yOffset,
              Math.sin(node.phase) * (node.orbitRadius * 0.65),
            ]}
          >
            <sphereGeometry args={[node.radius, 24, 24]} />
            <meshPhysicalMaterial
              color={node.tint}
              roughness={0.08}
              metalness={0.06}
              transmission={lowPower ? 0.55 : 0.88}
              thickness={0.85}
              ior={1.45}
              iridescence={0.55}
              clearcoat={1}
              clearcoatRoughness={0.05}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </Float>
    </group>
  )
}
