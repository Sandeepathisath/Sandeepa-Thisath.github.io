import { useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number
  reducedMotion?: boolean
  scrollProgressRef?: RefObject<number>
}

interface ShootingStarConfig {
  startX: number
  startY: number
  z: number
  speed: number
  cycleSeconds: number
  offsetSeconds: number
  color: string
  angle: number
}

const SHOOTING_STARS: ShootingStarConfig[] = [
  {
    startX: -8.5,
    startY: 5.5,
    z: -3.5,
    speed: 12,
    cycleSeconds: 7.2,
    offsetSeconds: 1.0,
    color: '#bae6fd',
    angle: -0.44,
  },
  {
    startX: 8.0,
    startY: 5.0,
    z: -4.8,
    speed: 10.5,
    cycleSeconds: 9.8,
    offsetSeconds: 4.2,
    color: '#f9a8d4',
    angle: -2.68,
  },
  {
    startX: -4.5,
    startY: 6.2,
    z: -6.0,
    speed: 11.5,
    cycleSeconds: 12.4,
    offsetSeconds: 7.8,
    color: '#fde68a',
    angle: -0.58,
  },
]

const STAR_COLORS = [
  '#7dd3fc', // glacial sky blue
  '#a5b4fc', // soft periwinkle
  '#6ee7b7', // calm mint
  '#fde68a', // warm champagne starlight
  '#f9a8d4', // soft rose quartz
  '#f8fafc', // pure white
]

function createStarTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createSparkleTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null
  const size = 64
  const half = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Soft center glow
  const glow = ctx.createRadialGradient(half, half, 0, half, half, half * 0.65)
  glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
  glow.addColorStop(0.28, 'rgba(255, 255, 255, 0.65)')
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  // Delicate 4-point celestial flare
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.beginPath()
  ctx.moveTo(half, 3)
  ctx.quadraticCurveTo(half + 2.5, half - 2.5, size - 3, half)
  ctx.quadraticCurveTo(half + 2.5, half + 2.5, half, size - 3)
  ctx.quadraticCurveTo(half - 2.5, half + 2.5, 3, half)
  ctx.quadraticCurveTo(half - 2.5, half - 2.5, half, 3)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createMeteorTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null
  const width = 128
  const height = 16
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createLinearGradient(0, 0, width, 0)
  grad.addColorStop(0, 'rgba(255, 255, 255, 0)')
  grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)')
  grad.addColorStop(0.9, 'rgba(255, 255, 255, 0.95)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 1)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 4, width, height - 8)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 43758.5453123
  return x - Math.floor(x)
}

function ShootingStar({
  config,
  texture,
  reducedMotion,
}: {
  config: ShootingStarConfig
  texture: THREE.CanvasTexture | null
  reducedMotion: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return
    if (reducedMotion) {
      matRef.current.opacity = 0
      return
    }

    const t = (state.clock.elapsedTime + config.offsetSeconds) % config.cycleSeconds
    const activeDuration = 1.4

    if (t > activeDuration) {
      matRef.current.opacity = 0
      return
    }

    const progress = t / activeDuration
    const distance = progress * config.speed
    meshRef.current.position.x = config.startX + Math.cos(config.angle) * distance
    meshRef.current.position.y = config.startY + Math.sin(config.angle) * distance
    meshRef.current.position.z = config.z

    const fade = Math.sin(progress * Math.PI)
    matRef.current.opacity = fade * 0.85
  })

  return (
    <mesh ref={meshRef} rotation={[0, 0, config.angle]}>
      <planeGeometry args={[1.85, 0.06]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture ?? undefined}
        color={config.color}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export function Particles({
  count = 320,
  reducedMotion = false,
  scrollProgressRef,
}: ParticlesProps) {
  const rootRef = useRef<THREE.Group>(null)
  const farStarsRef = useRef<THREE.Points>(null)
  const midStarsRef = useRef<THREE.Points>(null)
  const accentStarsRef = useRef<THREE.Points>(null)
  const farMatRef = useRef<THREE.PointsMaterial>(null)
  const midMatRef = useRef<THREE.PointsMaterial>(null)
  const accentMatRef = useRef<THREE.PointsMaterial>(null)

  const starTexture = useMemo(() => createStarTexture(), [])
  const sparkleTexture = useMemo(() => createSparkleTexture(), [])
  const meteorTexture = useMemo(() => createMeteorTexture(), [])

  const farCount = Math.round(count * 0.55)
  const midCount = Math.round(count * 0.3)
  const accentCount = Math.max(24, count - farCount - midCount)

  const palette = useMemo(() => STAR_COLORS.map((hex) => new THREE.Color(hex)), [])

  const buildStarLayer = (
    layerCount: number,
    spreadX: number,
    spreadY: number,
    zMin: number,
    zDepth: number,
    seedOffset: number,
  ) => {
    const pos = new Float32Array(layerCount * 3)
    const col = new Float32Array(layerCount * 3)

    for (let i = 0; i < layerCount; i++) {
      const i3 = i * 3
      pos[i3] = (seededRandom(i * 17.31 + seedOffset) - 0.5) * spreadX
      pos[i3 + 1] = (seededRandom(i * 41.73 + seedOffset * 1.7) - 0.5) * spreadY
      pos[i3 + 2] = zMin - seededRandom(i * 73.19 + seedOffset * 2.3) * zDepth

      const c = palette[i % palette.length]
      col[i3] = c.r
      col[i3 + 1] = c.g
      col[i3 + 2] = c.b
    }

    return { positions: pos, colors: col }
  }

  const farData = useMemo(() => buildStarLayer(farCount, 32, 22, -4, 14, 1.1), [farCount, palette])
  const midData = useMemo(() => buildStarLayer(midCount, 24, 16, -1.5, 8, 9.4), [midCount, palette])
  const accentData = useMemo(() => buildStarLayer(accentCount, 18, 12, -0.5, 5, 21.7), [accentCount, palette])

  useFrame((state, delta) => {
    const scroll = scrollProgressRef?.current ?? 0

    if (rootRef.current) {
      rootRef.current.position.y = THREE.MathUtils.lerp(
        rootRef.current.position.y,
        scroll * 1.4,
        0.05,
      )
    }

    if (reducedMotion) return

    const elapsed = state.clock.elapsedTime

    if (farStarsRef.current) {
      farStarsRef.current.rotation.y += delta * 0.011
      farStarsRef.current.rotation.x = THREE.MathUtils.lerp(
        farStarsRef.current.rotation.x,
        state.pointer.y * 0.035,
        0.025,
      )
    }

    if (midStarsRef.current) {
      midStarsRef.current.rotation.y -= delta * 0.019
      midStarsRef.current.rotation.z += delta * 0.006
      midStarsRef.current.rotation.x = THREE.MathUtils.lerp(
        midStarsRef.current.rotation.x,
        state.pointer.y * 0.065,
        0.03,
      )
    }

    if (accentStarsRef.current) {
      accentStarsRef.current.rotation.y += delta * 0.024
      accentStarsRef.current.rotation.x = THREE.MathUtils.lerp(
        accentStarsRef.current.rotation.x,
        state.pointer.y * 0.095,
        0.035,
      )
    }

    if (farMatRef.current) {
      farMatRef.current.opacity = 0.7 + Math.sin(elapsed * 1.1) * 0.14
    }
    if (midMatRef.current) {
      midMatRef.current.opacity = 0.68 + Math.sin(elapsed * 1.7 + 1.4) * 0.18
    }
    if (accentMatRef.current) {
      accentMatRef.current.opacity = 0.72 + Math.sin(elapsed * 2.2 + 2.8) * 0.22
    }
  })

  return (
    <group ref={rootRef}>
      {/* Layer 1: Distant colorful pinpoints */}
      <points ref={farStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[farData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={farMatRef}
          size={0.09}
          map={starTexture ?? undefined}
          vertexColors
          transparent
          opacity={0.74}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Layer 2: Midground glowing pastel stars */}
      <points ref={midStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[midData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[midData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={midMatRef}
          size={0.155}
          map={starTexture ?? undefined}
          vertexColors
          transparent
          opacity={0.72}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Layer 3: Foreground 4-point celestial sparkle stars */}
      <points ref={accentStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[accentData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[accentData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={accentMatRef}
          size={0.28}
          map={sparkleTexture ?? starTexture ?? undefined}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Gradient-tailed shooting stars */}
      {SHOOTING_STARS.map((star, index) => (
        <ShootingStar
          key={index}
          config={star}
          texture={meteorTexture}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}
