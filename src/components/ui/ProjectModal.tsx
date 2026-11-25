import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, ExternalLink, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { Project } from '../../types/portfolio'
import { GitHubIcon } from './BrandIcons'
import { TechIcon } from './TechIcon'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

const STATUS_LABELS: Record<Project['status'], string> = {
  featured: 'Featured Project',
  building: 'Currently Building',
  'coming-soon': 'Coming Soon',
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ backgroundColor: 'var(--modal-backdrop)' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="apple-glass-strong flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl"
          >
            {/* Fixed Modal Header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--divider)] px-5 py-4 sm:px-7">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="apple-pill inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[var(--text-primary)]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    <span>{STATUS_LABELS[project.status]}</span>
                  </span>
                  <span>{project.role}</span>
                  <span className="opacity-35">&middot;</span>
                  <span>{project.year}</span>
                </div>
                <h3
                  id="project-modal-title"
                  className="truncate text-lg font-semibold text-[var(--text-primary)] sm:text-xl"
                >
                  {project.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="apple-pill inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {/* Cover Image or Styled Banner */}
              <div
                style={{ backgroundColor: 'var(--surface-subtle)' }}
                className="overflow-hidden rounded-2xl border border-[var(--glass-border)]"
              >
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="max-h-72 w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-44 w-full flex-col items-center justify-center gap-2 px-6 text-center sm:h-52"
                    style={{
                      background: `radial-gradient(circle at 25% 25%, ${project.accentColor}34, var(--surface-subtle) 72%)`,
                    }}
                  >
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent-primary)]">
                      {project.tagline}
                    </p>
                    <p className="max-w-md text-sm text-[var(--text-secondary)]">
                      {project.shortDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Overview / Problem / Solution */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                    Overview
                  </h4>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                    {project.details.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="apple-glass rounded-2xl p-4">
                    <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-secondary)]">
                      Problem
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {project.details.problem}
                    </p>
                  </div>

                  <div className="apple-glass rounded-2xl p-4">
                    <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                      Solution
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {project.details.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              {project.details.features.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {project.details.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-primary)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Gallery Screenshots */}
              {project.details.gallery && project.details.gallery.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Gallery
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {project.details.gallery.map((imgSrc, index) => (
                      <div
                        key={imgSrc}
                        style={{ backgroundColor: 'var(--surface-subtle)' }}
                        className="overflow-hidden rounded-2xl border border-[var(--glass-border)]"
                      >
                        <img
                          src={imgSrc}
                          alt={`${project.title} screenshot ${index + 1}`}
                          loading="lazy"
                          className="h-44 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((techName) => (
                    <span
                      key={techName}
                      className="apple-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-[var(--text-primary)]"
                    >
                      <TechIcon name={techName} />
                      <span>{techName}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(project.githubUrl || project.liveUrl) && (
                <div className="flex flex-wrap items-center gap-3 border-t border-[var(--divider)] pt-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apple-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                    >
                      <GitHubIcon className="h-4 w-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-ink)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
