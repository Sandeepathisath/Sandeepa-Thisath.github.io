import { Suspense } from 'react'
import { SceneCanvas } from './components/canvas/SceneCanvas'
import { Footer } from './components/layout/Footer'
import { Loader } from './components/layout/Loader'
import { Navbar } from './components/layout/Navbar'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { TechStack } from './components/sections/TechStack'
import { useScrollProgress } from './hooks/useScrollProgress'

function App() {
  const { progressRef, isScrolled } = useScrollProgress()

  return (
    <div className="relative min-h-screen text-[var(--text-primary)]">
      {/* Isolated 3D Apple Liquid Glass Background */}
      <SceneCanvas scrollProgressRef={progressRef} />

      {/* Sticky Glass Navigation */}
      <Navbar isScrolled={isScrolled} />

      {/* Foreground Content */}
      <Suspense fallback={<Loader />}>
        <main className="relative z-10">
          <Hero />
          <About />
          <Projects />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App
