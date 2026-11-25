import { useEffect, useState } from 'react'
import { Download, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../../data/profile'

interface NavbarProps {
  isScrolled: boolean
}

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Tech Stack', href: '#tech-stack' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar({ isScrolled }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/[0.08] bg-[#0c111a]/75 shadow-lg shadow-black/25 backdrop-blur-2xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary Navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 2xl:max-w-7xl"
      >
        {/* Left: Clean Monogram + Name */}
        <a
          href="#top"
          className="group flex items-center gap-3 text-sm font-semibold tracking-tight text-[var(--text-primary)]"
        >
          <span className="apple-pill flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold text-[var(--accent-primary)] transition group-hover:border-white/25 group-hover:bg-white/12">
            ST
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Center: Clean Airy Links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative py-1 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 rounded-full bg-[var(--accent-primary)] transition-transform duration-200 group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Subtle Glass Download CV + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <a
            href={profile.cvUrl}
            download={profile.cvFileName}
            className="apple-pill hidden items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:border-white/25 hover:bg-white/[0.14] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            <span>Download CV</span>
          </a>

          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="apple-pill inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[var(--text-primary)] transition hover:bg-white/15 md:hidden"
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
            className="border-b border-white/10 bg-[#0c111a]/92 px-4 pb-5 pt-2 backdrop-blur-2xl md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-white/[0.08] hover:text-[var(--text-primary)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 border-t border-white/10 pt-3">
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
