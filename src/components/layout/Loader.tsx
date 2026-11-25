import { motion } from 'motion/react'

interface LoaderProps {
  label?: string
}

export function Loader({ label = 'Preparing workspace...' }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[var(--bg-canvas)]/90 backdrop-blur-xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        className="h-10 w-10 rounded-full border-2 border-white/15 border-t-[var(--accent-primary)]"
      />
      <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
        {label}
      </p>
    </div>
  )
}
