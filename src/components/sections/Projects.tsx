import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'motion/react'
import { projects } from '../../data/projects'
import type { Project } from '../../types/portfolio'
import { ProjectCard } from '../ui/ProjectCard'
import { ProjectModal } from '../ui/ProjectModal'

function getGridColumns(): number {
  if (typeof window === 'undefined') return 4
  if (window.innerWidth >= 1024) return 4 // Desktop: 4 columns
  if (window.innerWidth >= 640) return 2 // Tablet: 2 columns
  return 1 // Mobile: 1 column stacked
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [columns, setColumns] = useState(getGridColumns)

  useEffect(() => {
    const onResize = () => {
      setColumns(getGridColumns())
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Cap initial display at 2 rows for the active screen width
  const maxTwoRows = columns * 2
  const hasMoreThanTwoRows = projects.length > maxTwoRows
  const visibleProjects =
    hasMoreThanTwoRows && !showAll ? projects.slice(0, maxTwoRows) : projects
  const hiddenCount = Math.max(0, projects.length - maxTwoRows)

  return (
    <section
      id="projects"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-7 sm:px-6 sm:py-9 2xl:max-w-7xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            Projects
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Selected builds &amp; experiments.
          </h2>
          <p className="text-xs text-[var(--text-muted)] sm:text-sm">
            Click any project block to inspect full details.
          </p>
        </div>

        {/* Responsive Grid: 4 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <ProjectCard project={project} onSelect={setSelectedProject} />
            </motion.div>
          ))}
        </div>

        {/* Automatic "Show More" Toggle Whenever Projects Exceed 2 Rows */}
        {hasMoreThanTwoRows && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="apple-pill inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-[0.98] sm:text-sm"
            >
              <span>
                {showAll
                  ? 'Show Less'
                  : `Show More Projects (${hiddenCount} more)`}
              </span>
              {showAll ? (
                <ChevronUp className="h-4 w-4 text-[var(--accent-primary)]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[var(--accent-primary)]" />
              )}
            </button>
          </div>
        )}
      </motion.div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
