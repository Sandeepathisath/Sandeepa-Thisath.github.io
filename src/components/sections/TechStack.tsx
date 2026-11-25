import { motion } from 'motion/react'
import { skillCategories } from '../../data/skills'
import { GlassCard } from '../ui/GlassCard'
import { TechIcon } from '../ui/TechIcon'

export function TechStack() {
  return (
    <section
      id="tech-stack"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-7 sm:px-6 sm:py-9 2xl:max-w-7xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            Tech Stack
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Tools and technologies I work with.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {skillCategories.map((group, index) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <GlassCard interactive className="h-full p-6">
                <h3 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="apple-pill inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-white/25 hover:bg-white/15 hover:text-[var(--text-primary)]"
                    >
                      <TechIcon name={item} />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
