import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export interface ScrollProgressState {
  /** Normalized scroll progress (0 at top, 1 at bottom) for 60fps 3D reads without re-renders. */
  progressRef: RefObject<number>
  /** True once the page has scrolled past the initial top threshold (used for sticky navbar styling). */
  isScrolled: boolean
}

export function useScrollProgress(scrollThreshold = 24): ScrollProgressState {
  const progressRef = useRef(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let rafId = 0

    const update = () => {
      rafId = 0
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const y = window.scrollY
      progressRef.current = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0

      const nextScrolled = y > scrollThreshold
      setIsScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled))
    }

    const onScroll = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [scrollThreshold])

  return { progressRef, isScrolled }
}
