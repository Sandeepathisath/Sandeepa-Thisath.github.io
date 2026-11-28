import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  Play,
  PlayCircle,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { Project, ProjectGalleryItem } from '../../types/portfolio'
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

type ResolvedVideo =
  | { kind: 'iframe'; src: string; autoplaySrc: string }
  | { kind: 'video'; src: string }
  | null

function normalizeGalleryItem(
  item: string | ProjectGalleryItem,
  projectTitle: string,
  index: number,
): ProjectGalleryItem & { alt: string } {
  if (typeof item === 'string') {
    return { src: item, alt: `${projectTitle} screenshot ${index + 1}` }
  }
  return {
    src: item.src,
    badge: item.badge,
    caption: item.caption,
    alt: item.caption ?? `${projectTitle} screenshot ${index + 1}`,
  }
}

/**
 * Resolves external demo video links (YouTube, Google Drive, Vimeo) or local MP4/WebM paths
 * into safe embedded players without requiring a backend database.
 */
function resolveVideoSource(rawUrl?: string): ResolvedVideo {
  const trimmed = rawUrl?.trim()
  if (!trimmed) return null

  if (/^(https?:)?\/\//i.test(trimmed) === false && trimmed.startsWith('/') === false) {
    return null
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return { kind: 'video', src: trimmed }
  }

  try {
    const parsed = new URL(trimmed, 'https://example.com')

    if (parsed.hostname.includes('youtube.com')) {
      const videoId =
        parsed.searchParams.get('v') ??
        parsed.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]
      if (videoId) {
        const base = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
        return {
          kind: 'iframe',
          src: base,
          autoplaySrc: `${base}&autoplay=1`,
        }
      }
    }

    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\/+/, '').split('/')[0]
      if (videoId) {
        const base = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
        return {
          kind: 'iframe',
          src: base,
          autoplaySrc: `${base}&autoplay=1`,
        }
      }
    }

    if (parsed.hostname.includes('drive.google.com')) {
      const fileId = parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
      if (fileId) {
        const base = `https://drive.google.com/file/d/${fileId}/preview?rm=minimal`
        return {
          kind: 'iframe',
          src: base,
          autoplaySrc: `${base}&autoplay=1`,
        }
      }
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const clipId = parsed.pathname.replace(/^\/+/, '').split('/').pop()
      if (clipId && /^\d+$/.test(clipId)) {
        const base = `https://player.vimeo.com/video/${clipId}`
        return {
          kind: 'iframe',
          src: base,
          autoplaySrc: `${base}?autoplay=1`,
        }
      }
    }
  } catch {
    return null
  }

  return null
}

interface StudioVideoStageProps {
  projectTitle: string
  videoTitle: string
  videoSource: Exclude<ResolvedVideo, null>
  posterSrc?: string
  accentColor: string
}

function StudioVideoStage({
  projectTitle,
  videoTitle,
  videoSource,
  posterSrc,
  accentColor,
}: StudioVideoStageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFrameReady, setIsFrameReady] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[#060913] shadow-lg">
      {videoSource.kind === 'video' ? (
        <video
          src={videoSource.src}
          poster={posterSrc}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      ) : !isPlaying ? (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play ${projectTitle} walkthrough video`}
          className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        >
          {posterSrc ? (
            <img
              src={posterSrc}
              alt={`${projectTitle} demo preview`}
              className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="absolute inset-0 h-full w-full"
              style={{
                background: `radial-gradient(circle at 25% 25%, ${accentColor}30, #060913 75%)`,
              }}
            />
          )}

          {/* Subtle Cinema Scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#050811]/90 via-[#050811]/30 to-[#050811]/45 transition-opacity duration-300 group-hover:opacity-90"
          />

          {/* Top-Left Studio Chip */}
          <span className="apple-glass-strong absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white/90">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span>Inline Walkthrough</span>
          </span>

          {/* Center Frosted Glass Play Button */}
          <span className="pointer-events-none relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25 sm:h-[4.25rem] sm:w-[4.25rem]">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>

          {/* Bottom Info Caption */}
          <div className="absolute inset-x-4 bottom-3.5 z-10 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{videoTitle}</p>
              <p className="text-xs text-white/70">Click to launch player inside studio view</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="relative h-full w-full bg-[#060913]">
          {!isFrameReady && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-[#060913] text-xs text-white/75">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent-primary)]" />
              <span>Preparing video player...</span>
            </div>
          )}
          <iframe
            src={videoSource.autoplaySrc}
            title={`${projectTitle} demo video`}
            loading="eager"
            onLoad={() => setIsFrameReady(true)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className={`h-full w-full border-0 transition-opacity duration-300 ${
              isFrameReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      )}
    </div>
  )
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isTheaterMode, setIsTheaterMode] = useState(false)

  const galleryItems =
    project?.details.gallery?.map((item, idx) =>
      normalizeGalleryItem(item, project.title, idx),
    ) ?? []

  useEffect(() => {
    if (!project) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null)
        } else if (isTheaterMode) {
          setIsTheaterMode(false)
        } else {
          onClose()
        }
      } else if (lightboxIndex !== null && galleryItems.length > 1) {
        if (event.key === 'ArrowRight') {
          setLightboxIndex((prev) =>
            prev === null ? null : (prev + 1) % galleryItems.length,
          )
        } else if (event.key === 'ArrowLeft') {
          setLightboxIndex((prev) =>
            prev === null
              ? null
              : (prev - 1 + galleryItems.length) % galleryItems.length,
          )
        }
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, lightboxIndex, isTheaterMode, galleryItems.length, onClose])

  if (typeof document === 'undefined') return null

  const videoSource = resolveVideoSource(project?.details.videoUrl)

  const handleCloseModal = () => {
    setLightboxIndex(null)
    setIsTheaterMode(false)
    onClose()
  }

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
          onClick={handleCloseModal}
          style={{ backgroundColor: 'var(--modal-backdrop)' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className={`apple-glass-strong flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl transition-[max-width] duration-300 ${
              isTheaterMode ? 'max-w-6xl' : 'max-w-[940px]'
            }`}
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
                onClick={handleCloseModal}
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
                    className="aspect-[16/10] w-full object-cover"
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

              {/* Quick Summary Metadata (Project Type, Build Approach, etc.) */}
              {project.details.highlights && project.details.highlights.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {project.details.highlights.map((item) => (
                    <div key={item.label} className="apple-glass rounded-2xl p-4">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                        {item.label}
                      </p>
                      <p className="text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Embedded Demo Video (YouTube / Google Drive / Vimeo / MP4) */}
              {videoSource && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-[var(--accent-primary)]" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {project.details.videoTitle ?? 'Demo Video'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTheaterMode((prev) => !prev)}
                      className="apple-pill inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                    >
                      {isTheaterMode ? (
                        <>
                          <Minimize2 className="h-3 w-3 text-[var(--accent-primary)]" />
                          <span>Standard View</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-3 w-3 text-[var(--accent-primary)]" />
                          <span>Theater View (HD)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <StudioVideoStage
                    key={project.id}
                    projectTitle={project.title}
                    videoTitle={project.details.videoTitle ?? 'Demo Video'}
                    videoSource={videoSource}
                    posterSrc={project.details.videoPoster ?? project.coverImage}
                    accentColor={project.accentColor}
                  />
                </div>
              )}

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

              {/* Optional Gallery Screenshots (Click to Expand) */}
              {galleryItems.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Screenshots ({galleryItems.length})
                    </h4>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Click any preview to expand
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {galleryItems.map((item, index) => (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        style={{ backgroundColor: 'var(--surface-subtle)' }}
                        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {item.badge && (
                            <span className="apple-glass-strong absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-primary)]">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: project.accentColor }}
                              />
                              <span>{item.badge}</span>
                            </span>
                          )}
                          <span className="apple-glass-strong absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--text-primary)] opacity-85 transition group-hover:opacity-100">
                            <Maximize2 className="h-3 w-3 text-[var(--accent-primary)]" />
                            <span>Zoom</span>
                          </span>
                        </div>
                        {item.caption && (
                          <div className="border-t border-[var(--divider)] px-3 py-2 text-xs leading-snug text-[var(--text-secondary)]">
                            {item.caption}
                          </div>
                        )}
                      </button>
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

          {/* Screenshot Full-View Lightbox */}
          <AnimatePresence>
            {lightboxIndex !== null && galleryItems[lightboxIndex] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(event) => {
                  event.stopPropagation()
                  setLightboxIndex(null)
                }}
                style={{ backgroundColor: 'var(--modal-backdrop)' }}
                className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-lg"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close expanded screenshot"
                  className="apple-pill absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>

                <div
                  onClick={(event) => event.stopPropagation()}
                  className="relative flex max-w-[92vw] items-center justify-center gap-2 sm:gap-4"
                >
                  {galleryItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex(
                          (prev) =>
                            prev === null
                              ? null
                              : (prev - 1 + galleryItems.length) % galleryItems.length,
                        )
                      }
                      aria-label="Previous screenshot"
                      className="apple-pill inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}

                  <img
                    src={galleryItems[lightboxIndex].src}
                    alt={galleryItems[lightboxIndex].alt}
                    className="max-h-[82vh] max-w-[min(86vw,1240px)] rounded-2xl border border-[var(--glass-border)] object-contain shadow-2xl"
                  />

                  {galleryItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) =>
                          prev === null ? null : (prev + 1) % galleryItems.length,
                        )
                      }
                      aria-label="Next screenshot"
                      className="apple-pill inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {(galleryItems[lightboxIndex].badge || galleryItems[lightboxIndex].caption) && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="apple-glass-strong flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-full px-4 py-1.5 text-xs text-[var(--text-primary)]"
                  >
                    {galleryItems[lightboxIndex].badge && (
                      <span className="font-semibold text-[var(--accent-primary)]">
                        {galleryItems[lightboxIndex].badge}
                      </span>
                    )}
                    {galleryItems[lightboxIndex].badge &&
                      galleryItems[lightboxIndex].caption && (
                        <span className="opacity-40">&middot;</span>
                      )}
                    {galleryItems[lightboxIndex].caption && (
                      <span className="text-[var(--text-secondary)]">
                        {galleryItems[lightboxIndex].caption}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
