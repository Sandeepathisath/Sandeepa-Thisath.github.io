import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

interface ProtectedPortraitProps {
  src: string
  alt: string
  className?: string
}

const NO_CALLOUT_STYLE: CSSProperties = {
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
}

/**
 * Renders an image onto a non-interactive canvas behind a transparent shield
 * to block right-click image saving, drag-and-drop, and mobile long-press callouts.
 */
export function ProtectedPortrait({ src, alt, className = '' }: ProtectedPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const loaded = loadedSrc === src

  useEffect(() => {
    const drawCoverTop = () => {
      const container = containerRef.current
      const canvas = canvasRef.current
      const img = imageRef.current
      if (!container || !canvas || !img || !img.naturalWidth || !img.naturalHeight) return

      const boxW = container.clientWidth
      const boxH = container.clientHeight
      if (boxW <= 0 || boxH <= 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const targetW = Math.round(boxW * dpr)
      const targetH = Math.round(boxH * dpr)

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW
        canvas.height = targetH
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, boxW, boxH)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Match CSS `object-cover object-top`
      const scale = Math.max(boxW / img.naturalWidth, boxH / img.naturalHeight)
      const drawW = img.naturalWidth * scale
      const drawH = img.naturalHeight * scale
      const dx = (boxW - drawW) / 2
      const dy = 0

      ctx.drawImage(img, dx, dy, drawW, drawH)
    }

    let cancelled = false

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (cancelled) return
      imageRef.current = img
      drawCoverTop()
      setLoadedSrc(src)
    }
    img.src = src

    const observer = new ResizeObserver(drawCoverTop)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      cancelled = true
      observer.disconnect()
      imageRef.current = null
    }
  }, [src])

  return (
    <div
      ref={containerRef}
      draggable={false}
      style={{
        ...NO_CALLOUT_STYLE,
        backgroundColor: 'var(--surface-subtle)',
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`relative h-full w-full select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={alt}
        draggable={false}
        className={`pointer-events-none absolute inset-0 block h-full w-full transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Transparent protective overlay intercepts pointer/context actions so browsers never target the canvas */}
      <div
        aria-hidden="true"
        draggable={false}
        style={NO_CALLOUT_STYLE}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 z-10 select-none bg-transparent"
      />
    </div>
  )
}
