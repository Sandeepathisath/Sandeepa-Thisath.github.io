import type { Project } from '../../types/portfolio'
import { GlassCard } from './GlassCard'

interface ProjectCardProps {
  project: Project
  onSelect: (project: Project) => void
}

const STATUS_LABELS: Record<Project['status'], string> = {
  featured: 'Featured',
  building: 'Building',
  'coming-soon': 'Upcoming',
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      aria-label={`Open details for ${project.title}`}
      className="group block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:rounded-3xl"
    >
      <GlassCard interactive className="h-full rounded-2xl p-2.5 sm:rounded-3xl sm:p-3">
        {/* Top Visual: Cover Image OR 3D-Accented Apple Glass Banner */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-900/60 ring-1 ring-white/10 sm:rounded-2xl">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
              style={{
                background: `radial-gradient(circle at 25% 25%, ${project.accentColor}30, rgba(15, 23, 42, 0.72) 70%)`,
              }}
            >
              {/* Layered Translucent 3D-Inspired Glass Shapes */}
              <div
                aria-hidden="true"
                className="h-20 w-20 rounded-2xl border border-white/20 bg-white/[0.06] backdrop-blur-md transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"
                style={{
                  boxShadow: `0 12px 30px -10px ${project.accentColor}55, inset 0 1px 0 rgba(255,255,255,0.28)`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          )}

          {/* Subtle Status Chip */}
          <span className="apple-glass-strong absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-[var(--text-primary)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: project.accentColor }}
            />
            <span>{STATUS_LABELS[project.status]}</span>
          </span>
        </div>

        {/* Bottom: Clean Topic / Title Only */}
        <div className="px-1.5 pb-1 pt-3">
          <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)] sm:text-base">
            {project.title}
          </h3>
        </div>
      </GlassCard>
    </button>
  )
}
