import { useEffect, useRef } from 'react'

interface GlassFirefliesCanvasProps {
  isLight?: boolean
  reducedMotion?: boolean
  isCompactViewport?: boolean
}

interface Firefly {
  x: number
  y: number
  angle: number
  speed: number
  turnRate: number
  turnPhase: number
  radius: number
  glowScale: number
  pulsePhase: number
  pulseSpeed: number
  colorIndex: number
}

const DARK_COLORS = [
  '253, 230, 138', // warm amber glow
  '142, 202, 230', // liquid cyan
  '110, 231, 183', // soft mint
  '249, 168, 212', // dreamy rose
  '184, 192, 255', // lavender periwinkle
]

const LIGHT_COLORS = [
  '217, 119, 6',   // warm gold
  '2, 132, 199',   // sky cerulean
  '13, 148, 136',  // crisp teal
  '219, 39, 119',  // subtle rose
  '79, 70, 229',   // cosmic indigo
]

function createFireflies(width: number, height: number, count: number): Firefly[] {
  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    angle: Math.random() * Math.PI * 2,
    speed: 14 + Math.random() * 24,
    turnRate: 0.45 + Math.random() * 0.75,
    turnPhase: Math.random() * Math.PI * 2,
    radius: 1.5 + Math.random() * 2.1,
    glowScale: 5.5 + Math.random() * 4.5,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 1.1 + Math.random() * 1.6,
    colorIndex: index % DARK_COLORS.length,
  }))
}

export function GlassFirefliesCanvas({
  isLight = false,
  reducedMotion = false,
  isCompactViewport = false,
}: GlassFirefliesCanvasProps) {
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

    const count = isCompactViewport ? 14 : 26
    let fireflies = createFireflies(width, height, count)

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
        fireflies = fireflies.map((f) => ({ ...f, x: f.x * sx, y: f.y * sy }))
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    let rafId = 0
    let lastTime = performance.now()
    const margin = 36

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      const elapsed = now * 0.001
      const light = themeRef.current
      const palette = light ? LIGHT_COLORS : DARK_COLORS

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i]

        if (!reducedMotion) {
          // Organic meandering flight direction
          f.angle += Math.sin(elapsed * f.turnRate + f.turnPhase) * 0.9 * dt
          f.x += Math.cos(f.angle) * f.speed * dt
          f.y += Math.sin(f.angle) * f.speed * dt

          // Seamless edge wrap
          if (f.x < -margin) f.x = width + margin
          else if (f.x > width + margin) f.x = -margin
          if (f.y < -margin) f.y = height + margin
          else if (f.y > height + margin) f.y = -margin
        }

        const breath = reducedMotion
          ? 0.65
          : 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(elapsed * f.pulseSpeed + f.pulsePhase))
        const rgb = palette[f.colorIndex % palette.length]
        const haloRadius = f.radius * f.glowScale * (0.85 + breath * 0.3)

        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, haloRadius)
        if (light) {
          grad.addColorStop(0, `rgba(${rgb}, ${breath * 0.72})`)
          grad.addColorStop(0.35, `rgba(${rgb}, ${breath * 0.28})`)
          grad.addColorStop(1, `rgba(${rgb}, 0)`)
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${breath * 0.92})`)
          grad.addColorStop(0.22, `rgba(${rgb}, ${breath * 0.72})`)
          grad.addColorStop(0.55, `rgba(${rgb}, ${breath * 0.24})`)
          grad.addColorStop(1, `rgba(${rgb}, 0)`)
        }

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(f.x, f.y, haloRadius, 0, Math.PI * 2)
        ctx.fill()
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
