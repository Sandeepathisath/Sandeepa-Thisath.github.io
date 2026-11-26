import { useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface GalaxySceneProps {
  scrollProgressRef: RefObject<number>
  reducedMotion?: boolean
  lowPower?: boolean
  isLight?: boolean
  isCompactViewport?: boolean
}

const GALAXY_MOONS = [
  { orbitRadius: 2.35, yOffset: 0.42, speed: 0.42, phase: 0.5, radius: 0.16, tint: '#e9d5ff' },
  { orbitRadius: 2.05, yOffset: -0.5, speed: -0.34, phase: 2.6, radius: 0.13, tint: '#bae6fd' },
  { orbitRadius: 1.85, yOffset: 0.85, speed: 0.28, phase: 4.5, radius: 0.1, tint: '#fde68a' },
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 43758.5453123
  return x - Math.floor(x)
}

function createGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null
  const size = 64
  const half = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.82)')
  grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.22)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

interface SpiralGeometryData {
  positions: Float32Array
  ratios: Float32Array
}

function buildSpiralPositions(count: number, radiusScale: number): SpiralGeometryData {
  const positions = new Float32Array(count * 3)
  const ratios = new Float32Array(count)
  const branches = 3
  const spin = 1.15

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const r = Math.pow(seededRandom(i * 11.7 + 3.1), 0.72) * radiusScale
    const ratio = r / radiusScale
    ratios[i] = ratio

    const branchAngle = ((i % branches) / branches) * Math.PI * 2
    const spinAngle = r * spin

    const spread = 0.28 + ratio * 0.68
    const randomX = (seededRandom(i * 23.1 + 7.4) - 0.5) * spread * 2
    const randomY = (seededRandom(i * 37.9 + 1.9) - 0.5) * (0.35 + (1 - ratio) * 0.4)
    const randomZ = (seededRandom(i * 53.3 + 5.2) - 0.5) * spread * 2

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ
  }

  return { positions, ratios }
}

function fillSpiralColors(
  target: Float32Array,
  ratios: Float32Array,
  isLight: boolean,
) {
  const core = new THREE.Color(isLight ? '#d97706' : '#fef08a')
  const mid = new THREE.Color(isLight ? '#7c3aed' : '#c084fc')
  const outer = new THREE.Color(isLight ? '#0284c7' : '#38bdf8')
  const temp = new THREE.Color()

  for (let i = 0; i < ratios.length; i++) {
    const i3 = i * 3
    const t = ratios[i]
    if (t < 0.42) {
      temp.copy(core).lerp(mid, t / 0.42)
    } else {
      temp.copy(mid).lerp(outer, (t - 0.42) / 0.58)
    }
    target[i3] = temp.r
    target[i3 + 1] = temp.g
    target[i3 + 2] = temp.b
  }
}

function buildDeepStarField(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    pos[i3] = (seededRandom(i * 19.3 + 4.7) - 0.5) * 30
    pos[i3 + 1] = (seededRandom(i * 43.1 + 8.3) - 0.5) * 20
    pos[i3 + 2] = -3 - seededRandom(i * 67.9 + 2.1) * 14
  }
  return pos
}

export function GalaxyScene({
  scrollProgressRef,
  reducedMotion = false,
  lowPower = false,
  isLight = false,
  isCompactViewport = false,
}: GalaxySceneProps) {
  const planetGroupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const mainRingRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const moonRefs = useRef<Array<THREE.Mesh | null>>([])

  const galaxyGroupRef = useRef<THREE.Group>(null)
  const spiralRef = useRef<THREE.Points>(null)
  const spiralColorRef = useRef<THREE.BufferAttribute>(null)
  const starFieldRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const isWide = viewport.width >= 8.5
  const baseX = isWide ? 1.85 : 0
  const baseY = isWide ? 0.05 : 0.7
  const baseScale = isWide ? 1 : viewport.width < 5.5 ? 0.66 : 0.82

  const spiralCount = isCompactViewport ? 480 : 980
  const bgStarCount = isCompactViewport ? 110 : 220

  const glowTexture = useMemo(() => createGlowTexture(), [])
  useEffect(() => {
    return () => {
      glowTexture?.dispose()
    }
  }, [glowTexture])

  const spiralData = useMemo(() => buildSpiralPositions(spiralCount, 8.2), [spiralCount])
  const spiralColors = useMemo(() => new Float32Array(spiralCount * 3), [spiralCount])
  const bgStars = useMemo(() => buildDeepStarField(bgStarCount), [bgStarCount])

  useEffect(() => {
    fillSpiralColors(spiralColors, spiralData.ratios, isLight)
    if (spiralColorRef.current) {
      spiralColorRef.current.needsUpdate = true
    }
  }, [spiralColors, spiralData.ratios, isLight])

  useFrame((state, delta) => {
    const scroll = scrollProgressRef.current ?? 0

    if (planetGroupRef.current) {
      const targetX = baseX - scroll * (isWide ? 1.55 : 0)
      const targetY = baseY + scroll * 0.4
      const targetZ = -scroll * 1.5

      planetGroupRef.current.position.x = THREE.MathUtils.lerp(
        planetGroupRef.current.position.x,
        targetX,
        0.06,
      )
      planetGroupRef.current.position.y = THREE.MathUtils.lerp(
        planetGroupRef.current.position.y,
        targetY,
        0.06,
      )
      planetGroupRef.current.position.z = THREE.MathUtils.lerp(
        planetGroupRef.current.position.z,
        targetZ,
        0.06,
      )
    }

    if (galaxyGroupRef.current) {
      galaxyGroupRef.current.position.y = THREE.MathUtils.lerp(
        galaxyGroupRef.current.position.y,
        -0.3 + scroll * 1.25,
        0.05,
      )
    }

    if (reducedMotion) return

    const elapsed = state.clock.elapsedTime

    if (planetGroupRef.current) {
      const pointerRotX = -state.pointer.y * 0.22 + scroll * 0.45
      const pointerRotY = state.pointer.x * 0.3 + scroll * 0.85
      planetGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        planetGroupRef.current.rotation.x,
        pointerRotX,
        0.05,
      )
      planetGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        planetGroupRef.current.rotation.y,
        pointerRotY,
        0.05,
      )
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.16
    }
    if (mainRingRef.current) {
      mainRingRef.current.rotation.z += delta * 0.12
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.08
    }

    GALAXY_MOONS.forEach((moon, index) => {
      const mesh = moonRefs.current[index]
      if (!mesh) return
      const theta = elapsed * moon.speed + moon.phase
      mesh.position.x = Math.cos(theta) * moon.orbitRadius
      mesh.position.z = Math.sin(theta) * (moon.orbitRadius * 0.72)
      mesh.position.y = moon.yOffset + Math.sin(elapsed * 0.8 + moon.phase) * 0.15
    })

    if (spiralRef.current) {
      spiralRef.current.rotation.y += delta * 0.04
    }
    if (starFieldRef.current) {
      starFieldRef.current.rotation.y -= delta * 0.01
    }
  })

  const blendMode = isLight ? THREE.NormalBlending : THREE.AdditiveBlending

  return (
    <>
      {/* Background Spiral Galaxy & Deep Space Field */}
      <group ref={galaxyGroupRef} position={[-1.4, -0.3, -4.5]} rotation={[0.42, 0.12, -0.24]}>
        <points ref={spiralRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[spiralData.positions, 3]} />
            <bufferAttribute
              ref={spiralColorRef}
              attach="attributes-color"
              args={[spiralColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={isLight ? 0.19 : 0.18}
            map={glowTexture ?? undefined}
            vertexColors
            transparent
            opacity={isLight ? 0.62 : 0.85}
            sizeAttenuation
            depthWrite={false}
            blending={blendMode}
          />
        </points>

        <points ref={starFieldRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[bgStars, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            map={glowTexture ?? undefined}
            color={isLight ? '#6366f1' : '#e0e7ff'}
            transparent
            opacity={isLight ? 0.42 : 0.65}
            sizeAttenuation
            depthWrite={false}
            blending={blendMode}
          />
        </points>
      </group>

      {/* Ringed Cosmic Crystal Planet Centerpiece */}
      <group ref={planetGroupRef} position={[baseX, baseY, 0]} scale={baseScale}>
        <Float
          speed={reducedMotion ? 0 : 1.25}
          rotationIntensity={reducedMotion ? 0 : 0.2}
          floatIntensity={reducedMotion ? 0 : 0.36}
        >
          {/* Glowing Galactic Core */}
          <mesh>
            <sphereGeometry args={[0.52, 28, 28]} />
            <meshBasicMaterial
              color={isLight ? '#a855f7' : '#f472b6'}
              transparent
              opacity={isLight ? 0.22 : 0.32}
              blending={blendMode}
              depthWrite={false}
            />
          </mesh>

          {/* Translucent Cosmic Planet Body */}
          <mesh ref={planetRef}>
            <sphereGeometry args={[0.96, lowPower ? 32 : 56, lowPower ? 32 : 56]} />
            <meshPhysicalMaterial
              color={isLight ? '#ddd6fe' : '#e9d5ff'}
              roughness={0.09}
              metalness={0.08}
              transmission={lowPower ? 0.58 : 0.88}
              thickness={1.45}
              ior={1.46}
              iridescence={0.95}
              iridescenceIOR={1.38}
              clearcoat={1}
              clearcoatRoughness={0.05}
              attenuationColor={isLight ? '#7c3aed' : '#c084fc'}
              attenuationDistance={2.0}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Primary Sweeping Planetary Ring */}
          <mesh ref={mainRingRef} rotation={[Math.PI / 2.6, 0.24, 0]}>
            <torusGeometry args={[1.62, 0.055, 22, 120]} />
            <meshPhysicalMaterial
              color={isLight ? '#7c3aed' : '#38bdf8'}
              roughness={0.12}
              metalness={0.32}
              iridescence={0.8}
              clearcoat={1}
              transparent
              opacity={isLight ? 0.65 : 0.78}
            />
          </mesh>

          {/* Secondary Thin Cosmic Ring */}
          <mesh ref={outerRingRef} rotation={[Math.PI / 2.25, -0.28, 0.35]}>
            <torusGeometry args={[1.95, 0.028, 18, 110]} />
            <meshPhysicalMaterial
              color={isLight ? '#0284c7' : '#f472b6'}
              roughness={0.14}
              metalness={0.25}
              iridescence={0.75}
              clearcoat={1}
              transparent
              opacity={isLight ? 0.52 : 0.65}
            />
          </mesh>

          {/* Orbiting Crystal Moons */}
          {GALAXY_MOONS.map((moon, index) => (
            <mesh
              key={index}
              ref={(el) => {
                moonRefs.current[index] = el
              }}
              position={[
                Math.cos(moon.phase) * moon.orbitRadius,
                moon.yOffset,
                Math.sin(moon.phase) * (moon.orbitRadius * 0.72),
              ]}
            >
              <sphereGeometry args={[moon.radius, 22, 22]} />
              <meshPhysicalMaterial
                color={moon.tint}
                roughness={0.08}
                metalness={0.08}
                transmission={lowPower ? 0.5 : 0.85}
                thickness={0.75}
                ior={1.45}
                iridescence={0.65}
                clearcoat={1}
                transparent
                opacity={0.92}
              />
            </mesh>
          ))}
        </Float>
      </group>
    </>
  )
}
