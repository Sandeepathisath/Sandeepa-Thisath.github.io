import { useEffect, useRef } from 'react'

interface JungleRainCanvasProps {
  isLight?: boolean
  reducedMotion?: boolean
  isCompactViewport?: boolean
}

interface RainDrop {
  x: number
  y: number
  length: number
  speed: number
  thickness: number
  alpha: number
  layer: 0 | 1
}

interface SplashRipple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

interface FireflyMote {
  baseX: number
  baseY: number
  phase: number
  speed: number
  radius: number
  ampX: number
  ampY: number
}

function createRainDrops(width: number, height: number, count: number): RainDrop[] {
  return Array.from({ length: count }, (_, index) => {
    const layer: 0 | 1 = index % 3 === 0 ? 1 : 0
    return {
      x: Math.random() * (width + 120) - 60,
      y: Math.random() * height,
      length: layer === 1 ? 20 + Math.random() * 18 : 11 + Math.random() * 10,
      speed: layer === 1 ? 740 + Math.random() * 240 : 460 + Math.random() * 160,
      thickness: layer === 1 ? 1.45 : 0.9,
      alpha: layer === 1 ? 0.38 + Math.random() * 0.24 : 0.16 + Math.random() * 0.14,
      layer,
    }
  })
}

function createFireflies(width: number, height: number, count: number): FireflyMote[] {
  return Array.from({ length: count }, (_, index) => ({
    baseX: Math.random() * width,
    baseY: height * (0.25 + Math.random() * 0.68),
    phase: index * 1.37 + Math.random() * 3,
    speed: 0.45 + Math.random() * 0.6,
    radius: 1.4 + Math.random() * 1.9,
    ampX: 16 + Math.random() * 24,
    ampY: 10 + Math.random() * 18,
  }))
}

export function JungleRainCanvas({
  isLight = false,
  reducedMotion = false,
  isCompactViewport = false,
}: JungleRainCanvasProps) {
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

    const dropCount = isCompactViewport ? 48 : 96
    const fireflyCount = isCompactViewport ? 10 : 18

    let drops = createRainDrops(width, height, dropCount)
    let motes = createFireflies(width, height, fireflyCount)
    const splashes: SplashRipple[] = []

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
        drops = drops.map((d) => ({ ...d, x: d.x * sx, y: d.y * sy }))
        motes = motes.map((m) => ({ ...m, baseX: m.baseX * sx, baseY: m.baseY * sy }))
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const slant = 0.14
    let rafId = 0
    let lastTime = performance.now()

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      const elapsed = now * 0.001
      const light = themeRef.current

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      // 1. Falling angled raindrops
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]
        if (!reducedMotion) {
          drop.y += drop.speed * dt
          drop.x -= drop.speed * slant * dt

          if (drop.y > height + 10) {
            if (drop.layer === 1 && splashes.length < 28 && Math.random() < 0.65) {
              splashes.push({
                x: drop.x,
                y: height - 8 - Math.random() * Math.min(48, height * 0.06),
                radius: 2,
                maxRadius: 11 + Math.random() * 9,
                alpha: 0.45,
              })
            }
            drop.y = -drop.length - Math.random() * 60
            drop.x = Math.random() * (width + 140)
          }
          if (drop.x < -80) {
            drop.x += width + 140
          }
        }

        const tailX = drop.x + drop.length * slant
        const tailY = drop.y - drop.length
        const grad = ctx.createLinearGradient(tailX, tailY, drop.x, drop.y)
        if (light) {
          grad.addColorStop(0, 'rgba(13, 148, 136, 0)')
          grad.addColorStop(1, `rgba(13, 148, 136, ${drop.alpha * 0.72})`)
        } else {
          grad.addColorStop(0, 'rgba(167, 243, 208, 0)')
          grad.addColorStop(1, `rgba(167, 243, 208, ${drop.alpha})`)
        }

        ctx.strokeStyle = grad
        ctx.lineWidth = drop.thickness
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(drop.x, drop.y)
        ctx.stroke()
      }

      // 2. Canopy floor splash ripples
      if (!reducedMotion) {
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i]
          s.radius += dt * 34
          s.alpha -= dt * 0.95

          if (s.alpha <= 0 || s.radius >= s.maxRadius) {
            splashes.splice(i, 1)
            continue
          }

          ctx.strokeStyle = light
            ? `rgba(15, 118, 110, ${s.alpha * 0.5})`
            : `rgba(110, 231, 183, ${s.alpha * 0.65})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.ellipse(s.x, s.y, s.radius, s.radius * 0.34, 0, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // 3. Soft drifting forest fireflies (dark) / sunlit mist motes (light)
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i]
        const mx = reducedMotion
          ? m.baseX
          : m.baseX + Math.sin(elapsed * m.speed + m.phase) * m.ampX
        const my = reducedMotion
          ? m.baseY
          : m.baseY + Math.cos(elapsed * m.speed * 0.8 + m.phase) * m.ampY
        const pulse = reducedMotion
          ? 0.55
          : 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(elapsed * 2.1 + m.phase))

        const glowR = m.radius * 5.2
        const orbGrad = ctx.createRadialGradient(mx, my, 0, mx, my, glowR)
        if (light) {
          orbGrad.addColorStop(0, `rgba(16, 185, 129, ${pulse * 0.42})`)
          orbGrad.addColorStop(1, 'rgba(16, 185, 129, 0)')
        } else {
          orbGrad.addColorStop(0, `rgba(190, 242, 100, ${pulse * 0.85})`)
          orbGrad.addColorStop(0.45, `rgba(52, 211, 153, ${pulse * 0.35})`)
          orbGrad.addColorStop(1, 'rgba(52, 211, 153, 0)')
        }

        ctx.fillStyle = orbGrad
        ctx.beginPath()
        ctx.arc(mx, my, glowR, 0, Math.PI * 2)
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
