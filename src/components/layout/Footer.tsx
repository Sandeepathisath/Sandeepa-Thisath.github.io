import type { MouseEvent } from 'react'
import { ArrowUp, Mail } from 'lucide-react'
import { profile } from '../../data/profile'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'

function normalizeHref(url: string): string {
  if (/^(https?:|mailto:|tel:|\/)/i.test(url)) return url
  return `https://${url}`
}

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const year = CURRENT_YEAR
  const githubSocial = profile.socials.find((item) => item.icon === 'github')
  const linkedinHref = normalizeHref(profile.linkedinUrl)

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      style={{
        backgroundColor: 'var(--footer-bg)',
        borderColor: 'var(--divider)',
      }}
      className="relative z-10 border-t backdrop-blur-xl transition-colors duration-300"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:px-6 2xl:max-w-7xl">
        <p>
          &copy; {year} {profile.name}. Built with React, Three.js &amp; Tailwind CSS.
        </p>

        <div className="flex items-center gap-3">
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="apple-pill inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:scale-105 hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
          </a>

          {githubSocial && (
            <a
              href={normalizeHref(githubSocial.url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="apple-pill inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:scale-105 hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
            </a>
          )}

          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="apple-pill inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:scale-105 hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>

          <a
            href="#top"
            onClick={scrollToTop}
            className="apple-pill ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-95"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
          </a>
        </div>
      </div>
    </footer>
  )
}
