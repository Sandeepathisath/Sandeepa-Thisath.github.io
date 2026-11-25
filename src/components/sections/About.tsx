import { MapPin, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { profile } from '../../data/profile'
import { GlassCard } from '../ui/GlassCard'

const PILLAR_ACCENTS = [
  'var(--accent-primary)',
  'var(--accent-secondary)',
  '#10b981',
]

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-7 sm:px-6 sm:py-9 2xl:max-w-7xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Section Heading */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            About
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Grounded engineering, steady learning.
          </h2>
        </div>

        {/* Bio Glass Summary */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              {profile.bio}
            </p>
            <div className="flex shrink-0 flex-wrap gap-2.5 lg:flex-col lg:items-end">
              <span className="apple-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-[var(--text-primary)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                <span>{profile.location}</span>
              </span>
              <span className="apple-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-[var(--text-secondary)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent-secondary)]" />
                <span>{profile.availability}</span>
              </span>
            </div>
          </div>
        </GlassCard>

        {/* 3 Focus Pillars */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {profile.focusPillars.map((pillar, index) => {
            const dotColor = PILLAR_ACCENTS[index % PILLAR_ACCENTS.length]
            return (
              <motion.div
                key={pillar.tag}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <GlassCard interactive className="h-full p-6">
                  <div className="space-y-3">
                    <span className="apple-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[var(--text-primary)]">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span>{pillar.tag}</span>
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {pillar.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
