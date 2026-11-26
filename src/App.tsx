import { Suspense, lazy } from 'react'
import { MotionConfig } from 'motion/react'
import { Footer } from './components/layout/Footer'
import { Loader } from './components/layout/Loader'
import { Navbar } from './components/layout/Navbar'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { TechStack } from './components/sections/TechStack'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useTheme } from './hooks/useTheme'

const SceneCanvas = lazy(() =>
  import('./components/canvas/SceneCanvas').then((m) => ({ default: m.SceneCanvas })),
)

function App() {
  const { progressRef, isScrolled } = useScrollProgress()
  const { world, isLight, toggleTheme, setWorld } = useTheme()

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen text-[var(--text-primary)]">
        {/* Keyboard Accessibility Skip Link */}
        <a
          href="#main-content"
          className="apple-glass-strong sr-only fixed left-4 top-4 z-50 rounded-full px-4 py-2 text-xs font-semibold text-[var(--text-primary)] focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
        >
          Skip to main content
        </a>

        {/* Isolated Multi-World 3D Background (Lazy Loaded for Fast First Paint) */}
        <Suspense fallback={null}>
          <SceneCanvas
            scrollProgressRef={progressRef}
            isLight={isLight}
            world={world}
          />
        </Suspense>

        {/* Sticky Glass Navigation with Atmosphere World & Mode Toggles */}
        <Navbar
          isScrolled={isScrolled}
          isLight={isLight}
          world={world}
          onToggleTheme={toggleTheme}
          onChangeWorld={setWorld}
        />

        {/* Foreground Content */}
        <Suspense fallback={<Loader />}>
          <main id="main-content" className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <TechStack />
            <Contact />
          </main>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  )
}

export default App
