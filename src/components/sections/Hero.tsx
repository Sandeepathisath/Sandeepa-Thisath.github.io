import { useState } from 'react'
import type { MouseEvent } from 'react'
import { ChevronDown, Eye, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { profile } from '../../data/profile'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { CvModal } from '../ui/CvModal'

function normalizeHref(url: string): string {
  if (/^(https?:|mailto:|tel:|\/)/i.test(url)) return url
  return `https://${url}`
}

export function Hero() {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 })
  const [cvModalOpen, setCvModalOpen] = useState(false)

  const githubSocial = profile.socials.find((item) => item.icon === 'github')
  const linkedinHref = normalizeHref(profile.linkedinUrl)

  const handlePortraitMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    setTilt({
      rotateX: (0.5 - py) * 8,
      rotateY: (px - 0.5) * 10,
      glareX: px * 100,
      glareY: py * 100,
    })
  }

  const resetPortraitTilt = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 })
  }

  return (
    <>
      <section
        id="top"
        className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 2xl:max-w-7xl"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left: Headline, Bio & Clean Actions (Popup View CV, LinkedIn, GitHub) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="order-2 space-y-6 lg:order-1 lg:col-span-7"
          >
            <div className="apple-pill inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] sm:text-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  boxShadow: '0 0 8px rgba(142, 202, 230, 0.7)',
                }}
              />
              <span>{profile.availability}</span>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium tracking-wide text-[var(--accent-primary)]">
                {profile.role}
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                {profile.headline}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                {profile.subheadline}
              </p>
            </div>

            {/* Action Pills: View CV (Popup), LinkedIn, GitHub */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setCvModalOpen(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:brightness-105 active:scale-[0.98]"
              >
                <Eye className="h-4 w-4" />
                <span>View CV</span>
              </button>

              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/15"
              >
                <LinkedInIcon className="h-4 w-4 text-[var(--accent-secondary)]" />
                <span>LinkedIn</span>
              </a>

              {githubSocial && (
                <a
                  href={normalizeHref(githubSocial.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/15"
                >
                  <GitHubIcon className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Right: Original Portrait in Modern Sleek Apple Glass Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end"
          >
            <div
              onMouseMove={handlePortraitMove}
              onMouseLeave={resetPortraitTilt}
              style={{ perspective: '1000px' }}
              className="w-full max-w-[270px] sm:max-w-[310px] lg:max-w-[335px]"
            >
              <div
                style={{
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="apple-glass-strong relative overflow-hidden rounded-[28px] p-2.5 sm:p-3"
              >
                {/* Cursor-reactive glass sheen */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 opacity-60"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.16), transparent 55%)`,
                  }}
                />

                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] ring-1 ring-white/15">
                  <img
                    src={profile.avatar}
                    alt={`${profile.name} portrait`}
                    className="h-full w-full object-cover object-top"
                  />

                  {/* Subtle bottom gradient for readable overlay chip */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c111a]/85 via-[#0c111a]/35 to-transparent"
                  />

                  <div className="apple-glass-strong absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl px-3 py-2 text-xs text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                      <span className="font-medium text-[var(--text-primary)]">
                        {profile.location}
                      </span>
                    </span>
                    <span className="text-[var(--text-secondary)]">CS Undergrad</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gentle Scroll Indicator */}
        <div className="mt-5 flex justify-center lg:mt-6">
          <a
            href="#about"
            aria-label="Scroll to content"
            className="apple-pill inline-flex flex-col items-center gap-0.5 rounded-full px-3.5 py-1.5 text-xs text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-primary)]"
          >
            <span>Scroll</span>
            <ChevronDown className="h-3.5 w-3.5 animate-bounce text-[var(--accent-primary)]" />
          </a>
        </div>
      </section>

      {/* Scrollable CV Popup Modal (Opens on "View CV" without downloading) */}
      <CvModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </>
  )
}
