import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../../data/profile'

interface NavbarProps {
  isScrolled: boolean
  isLight: boolean
  onToggleTheme: () => void
}

const NAV_ITEMS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'tech-stack', label: 'Tech Stack', href: '#tech-stack' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export function Navbar({ isScrolled, isLight, onToggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  // Lightweight scroll-spy highlighting active section in navbar
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id)
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 140) {
          setActiveId(null)
          return
        }
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-28% 0px -52% 0px',
        threshold: [0.1, 0.35, 0.6],
      },
    )

    elements.forEach((el) => observer.observe(el))

    const onScrollTopReset = () => {
      if (window.scrollY < 140) {
        setActiveId(null)
      }
    }
    window.addEventListener('scroll', onScrollTopReset, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScrollTopReset)
    }
  }, [])

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header
      style={{
        backgroundColor: isScrolled ? 'var(--nav-scrolled-bg)' : 'transparent',
        borderColor: isScrolled ? 'var(--divider)' : 'transparent',
      }}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-black/10 backdrop-blur-2xl' : ''
      }`}
    >
      <nav
        aria-label="Primary Navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 2xl:max-w-7xl"
      >
        {/* Left: Clean Monogram + Name */}
        <a
          href="#top"
          onClick={scrollToTop}
          className="group flex items-center gap-3 rounded-xl text-sm font-semibold tracking-tight text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        >
          <span className="apple-pill flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold text-[var(--accent-primary)] transition-transform duration-200 group-hover:scale-105">
            ST
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Center: Clean Airy Links with Scroll-Spy */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group relative rounded-md py-1 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
                    isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px rounded-full bg-[var(--accent-primary)] transition-transform duration-200 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right: Theme Toggle + Download CV + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            className="apple-pill inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-95"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isLight ? 'moon' : 'sun'}
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center justify-center"
              >
                {isLight ? (
                  <Moon className="h-4 w-4 text-[var(--accent-secondary)]" />
                ) : (
                  <Sun className="h-4 w-4 text-[var(--accent-primary)]" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href={profile.cvUrl}
            download={profile.cvFileName}
            className="apple-pill hidden items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-95 sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span>Download CV</span>
          </a>

          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="apple-pill inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Glass Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              backgroundColor: 'var(--drawer-bg)',
              borderColor: 'var(--divider)',
            }}
            className="border-b px-4 pb-5 pt-2 backdrop-blur-2xl md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition hover:bg-[var(--pill-bg)] hover:text-[var(--text-primary)] ${
                        isActive
                          ? 'bg-[var(--pill-bg)] text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]"
                        />
                      )}
                    </a>
                  </li>
                )
              })}
              <li className="mt-2 border-t border-[var(--divider)] pt-3">
                <a
                  href={profile.cvUrl}
                  download={profile.cvFileName}
                  onClick={() => setMenuOpen(false)}
                  className="apple-pill flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
                >
                  <Download className="h-4 w-4 text-[var(--accent-primary)]" />
                  <span>Download CV</span>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
