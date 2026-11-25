import { useEffect, useState } from 'react'

export interface MotionPreferences {
  prefersReducedMotion: boolean
  isCompactViewport: boolean
  lowPower: boolean
}

export function useReducedMotion(): MotionPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const [isCompactViewport, setIsCompactViewport] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    const onResize = () => {
      setIsCompactViewport(window.innerWidth < 768)
    }

    motionQuery.addEventListener('change', onMotionChange)
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      motionQuery.removeEventListener('change', onMotionChange)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const lowHardware =
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 2

  return {
    prefersReducedMotion,
    isCompactViewport,
    lowPower: prefersReducedMotion || isCompactViewport || lowHardware,
  }
}
