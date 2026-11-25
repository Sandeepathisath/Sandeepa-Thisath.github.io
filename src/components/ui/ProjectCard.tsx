import { ArrowUpRight } from 'lucide-react'
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
      className="group block w-full cursor-pointer text-left focus:outline-none focus-visible:rounded-3xl focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
    >
      <GlassCard interactive className="h-full rounded-2xl p-2.5 sm:rounded-3xl sm:p-3">
        {/* Top Visual: Cover Image OR 3D-Accented Apple Glass Banner */}
        <div
          style={{ backgroundColor: 'var(--surface-subtle)' }}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-[var(--glass-border)] sm:rounded-2xl"
        >
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
                background: `radial-gradient(circle at 25% 25%, ${project.accentColor}38, var(--surface-subtle) 72%)`,
              }}
            >
              {/* Layered Translucent 3D-Inspired Glass Shapes (theme-adaptive) */}
              <div
                aria-hidden="true"
                className="h-20 w-20 rounded-2xl border backdrop-blur-md transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--pill-bg)',
                  borderColor: 'var(--glass-border)',
                  boxShadow: `0 12px 30px -10px ${project.accentColor}55, inset 0 1px 0 var(--glass-highlight)`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full border backdrop-blur-sm transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--pill-bg)',
                  borderColor: 'var(--glass-border)',
                }}
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

        {/* Bottom: Clean Topic / Title Only + Hover Affordance */}
        <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-3">
          <h3 className="truncate text-sm font-semibold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)] sm:text-base">
            {project.title}
          </h3>
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[var(--text-muted)] opacity-50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent-primary)] group-hover:opacity-100"
          />
        </div>
      </GlassCard>
    </button>
  )
}
