import { useEffect, useRef } from 'react'

interface OceanLifeCanvasProps {
  isLight?: boolean
  reducedMotion?: boolean
  isCompactViewport?: boolean
}

interface SwimmingFish {
  x: number
  baseY: number
  size: number
  speed: number
  direction: 1 | -1
  phase: number
  wagSpeed: number
  waveAmp: number
  paletteIndex: number
  alpha: number
}

interface AirBubble {
  x: number
  y: number
  radius: number
  speed: number
  phase: number
  alpha: number
}

const DARK_FISH_PALETTES = [
  { body: '#38bdf8', fin: '#7dd3fc', belly: '#e0f2fe' },
  { body: '#2dd4bf', fin: '#5eead4', belly: '#ccfbf1' },
  { body: '#fb923c', fin: '#fdba74', belly: '#ffedd5' },
  { body: '#facc15', fin: '#fde047', belly: '#fef9c3' },
  { body: '#818cf8', fin: '#a5b4fc', belly: '#e0e7ff' },
]

const LIGHT_FISH_PALETTES = [
  { body: '#0284c7', fin: '#38bdf8', belly: '#bae6fd' },
  { body: '#0d9488', fin: '#2dd4bf', belly: '#99f6e4' },
  { body: '#ea580c', fin: '#fb923c', belly: '#fed7aa' },
  { body: '#ca8a04', fin: '#eab308', belly: '#fef08a' },
  { body: '#4f46e5', fin: '#818cf8', belly: '#c7d2fe' },
]

function createFishGroup(width: number, height: number, compact: boolean): SwimmingFish[] {
  const result: SwimmingFish[] = []

  // Graceful solo & pair reef fish across depths
  const soloCount = compact ? 5 : 9
  for (let i = 0; i < soloCount; i++) {
    const dir: 1 | -1 = i % 2 === 0 ? 1 : -1
    const size = 14 + (i % 4) * 5.5
    result.push({
      x: Math.random() * width,
      baseY: height * (0.16 + ((i * 0.618) % 0.72)),
      size,
      speed: 28 + (i % 5) * 11,
      direction: dir,
      phase: i * 1.45,
      wagSpeed: 5.5 + (i % 3) * 1.5,
      waveAmp: 8 + (i % 3) * 5,
      paletteIndex: i % 5,
      alpha: 0.44 + (i % 3) * 0.12,
    })
  }

  // Cohesive tiny school of minnows gliding smoothly together
  const schoolCount = compact ? 3 : 5
  const schoolBaseX = width * 0.35
  const schoolBaseY = height * 0.62
  for (let i = 0; i < schoolCount; i++) {
    result.push({
      x: (schoolBaseX + i * 28 + Math.random() * 14) % width,
      baseY: schoolBaseY + (i - 2) * 15,
      size: 9.5 + (i % 2) * 2,
      speed: 52,
      direction: 1,
      phase: i * 0.6,
      wagSpeed: 8.5,
      waveAmp: 6,
      paletteIndex: i % 2,
      alpha: 0.48,
    })
  }

  return result
}

function createBubbles(width: number, height: number, compact: boolean): AirBubble[] {
  const count = compact ? 18 : 34
  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 1.8 + Math.random() * 4.2,
    speed: 22 + Math.random() * 32,
    phase: index * 1.13 + Math.random() * 2,
    alpha: 0.22 + Math.random() * 0.32,
  }))
}

function drawFish(
  ctx: CanvasRenderingContext2D,
  fish: SwimmingFish,
  y: number,
  elapsed: number,
  light: boolean,
  reducedMotion: boolean,
) {
  const palettes = light ? LIGHT_FISH_PALETTES : DARK_FISH_PALETTES
  const colors = palettes[fish.paletteIndex % palettes.length]
  const s = fish.size
  const tailWag = reducedMotion ? 0 : Math.sin(elapsed * fish.wagSpeed + fish.phase) * 0.36

  ctx.save()
  ctx.translate(fish.x, y)
  ctx.scale(fish.direction, 1)
  ctx.globalAlpha = fish.alpha * (light ? 0.88 : 0.95)

  // Gentle vertical body tilt synced with wave motion
  if (!reducedMotion) {
    const slope = Math.cos(elapsed * 1.1 + fish.phase) * 0.06
    ctx.rotate(slope)
  }

  // Animated forked tail fin
  ctx.save()
  ctx.translate(-s * 0.72, 0)
  ctx.rotate(tailWag)
  ctx.fillStyle = colors.fin
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(-s * 0.45, -s * 0.45, -s * 0.62, -s * 0.36)
  ctx.quadraticCurveTo(-s * 0.35, 0, -s * 0.62, s * 0.36)
  ctx.quadraticCurveTo(-s * 0.45, s * 0.45, 0, 0)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Dorsal fin
  ctx.fillStyle = colors.fin
  ctx.beginPath()
  ctx.moveTo(-s * 0.2, -s * 0.28)
  ctx.quadraticCurveTo(s * 0.05, -s * 0.62, s * 0.3, -s * 0.25)
  ctx.closePath()
  ctx.fill()

  // Streamlined fish body with soft gradient
  const bodyGrad = ctx.createLinearGradient(0, -s * 0.4, 0, s * 0.4)
  bodyGrad.addColorStop(0, colors.body)
  bodyGrad.addColorStop(0.65, colors.fin)
  bodyGrad.addColorStop(1, colors.belly)

  ctx.fillStyle = bodyGrad
  ctx.beginPath()
  ctx.moveTo(s * 0.9, 0)
  ctx.bezierCurveTo(s * 0.52, -s * 0.48, -s * 0.35, -s * 0.44, -s * 0.78, 0)
  ctx.bezierCurveTo(-s * 0.35, s * 0.44, s * 0.52, s * 0.48, s * 0.9, 0)
  ctx.closePath()
  ctx.fill()

  // Pectoral side fin
  ctx.fillStyle = colors.belly
  ctx.globalAlpha *= 0.65
  ctx.beginPath()
  ctx.ellipse(s * 0.14, s * 0.12, s * 0.22, s * 0.11, -0.35 + tailWag * 0.25, 0, Math.PI * 2)
  ctx.fill()

  // Tiny eye & glint
  ctx.globalAlpha = fish.alpha * 0.95
  ctx.fillStyle = light ? '#082032' : '#03111c'
  ctx.beginPath()
  ctx.arc(s * 0.54, -s * 0.08, Math.max(1.2, s * 0.085), 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(s * 0.56, -s * 0.1, Math.max(0.5, s * 0.035), 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

export function OceanLifeCanvas({
  isLight = false,
  reducedMotion = false,
  isCompactViewport = false,
}: OceanLifeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeRef = useRef(isLight)
  useEffect(() => {
    themeRef.current = isLight
  }, [isLight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    let fishes = createFishGroup(width, height, isCompactViewport)
    let bubbles = createBubbles(width, height, isCompactViewport)

    const resize = () => {
      const prevW = width
      const prevH = height
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      if (prevW > 0 && prevH > 0) {
        const sx = width / prevW
        const sy = height / prevH
        fishes = fishes.map((f) => ({ ...f, x: f.x * sx, baseY: f.baseY * sy }))
        bubbles = bubbles.map((b) => ({ ...b, x: b.x * sx, y: b.y * sy }))
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    let rafId = 0
    let lastTime = performance.now()

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      const elapsed = now * 0.001
      const light = themeRef.current

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // 1. Rising glossy air bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i]
        if (!reducedMotion) {
          b.y -= b.speed * dt
          if (b.y < -20) {
            b.y = height + 16
            b.x = Math.random() * width
          }
        }

        const wobbleX = reducedMotion ? 0 : Math.sin(elapsed * 1.4 + b.phase) * 6
        const bx = b.x + wobbleX

        ctx.save()
        ctx.strokeStyle = light
          ? `rgba(2, 132, 199, ${b.alpha * 0.72})`
          : `rgba(186, 230, 253, ${b.alpha * 0.9})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(bx, b.y, b.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Specular bubble highlight dot
        ctx.fillStyle = light
          ? `rgba(255, 255, 255, ${b.alpha * 1.1})`
          : `rgba(240, 249, 255, ${b.alpha})`
        ctx.beginPath()
        ctx.arc(bx - b.radius * 0.35, b.y - b.radius * 0.35, Math.max(0.7, b.radius * 0.26), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 2. Gracefully swimming fish
      for (let i = 0; i < fishes.length; i++) {
        const fish = fishes[i]
        if (!reducedMotion) {
          fish.x += fish.speed * fish.direction * dt
          if (fish.direction === 1 && fish.x > width + 70) {
            fish.x = -70
          } else if (fish.direction === -1 && fish.x < -70) {
            fish.x = width + 70
          }
        }

        const y = reducedMotion
          ? fish.baseY
          : fish.baseY + Math.sin(elapsed * 1.1 + fish.phase) * fish.waveAmp

        drawFish(ctx, fish, y, elapsed, light, reducedMotion)
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame)
      }
    }

    rafId = window.requestAnimationFrame(renderFrame)

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion, isCompactViewport])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  )
}
