import { useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  strong?: boolean
  interactive?: boolean
}

export function GlassCard({
  children,
  className = '',
  strong = false,
  interactive = false,
}: GlassCardProps) {
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false })

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    const rect = event.currentTarget.getBoundingClientRect()
    setGlare({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
      active: true,
    })
  }

  const handleMouseLeave = () => {
    if (!interactive) return
    setGlare((prev) => ({ ...prev, active: false }))
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
        strong ? 'apple-glass-strong' : 'apple-glass'
      } ${
        interactive ? 'hover:-translate-y-1 hover:border-white/25' : ''
      } ${className}`}
    >
      {interactive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glare.active ? 0.55 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.14), transparent 55%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
