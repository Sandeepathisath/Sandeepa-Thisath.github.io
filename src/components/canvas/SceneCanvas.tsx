import { Suspense, lazy, useState } from 'react'
import type { RefObject } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { ThemeWorld } from '../../hooks/useTheme'
import { GalaxyScene } from './GalaxyScene'

const HeroObject = lazy(() =>
  import('./HeroObject').then((m) => ({ default: m.HeroObject })),
)
const JungleScene = lazy(() =>
  import('./JungleScene').then((m) => ({ default: m.JungleScene })),
)
const JungleBackdrop = lazy(() =>
  import('./JungleBackdrop').then((m) => ({ default: m.JungleBackdrop })),
)
const JungleRainCanvas = lazy(() =>
  import('./JungleRainCanvas').then((m) => ({ default: m.JungleRainCanvas })),
)
const OceanScene = lazy(() =>
  import('./OceanScene').then((m) => ({ default: m.OceanScene })),
)
const OceanBackdrop = lazy(() =>
  import('./OceanBackdrop').then((m) => ({ default: m.OceanBackdrop })),
)
const OceanLifeCanvas = lazy(() =>
  import('./OceanLifeCanvas').then((m) => ({ default: m.OceanLifeCanvas })),
)
const GlassFirefliesCanvas = lazy(() =>
  import('./GlassFirefliesCanvas').then((m) => ({ default: m.GlassFirefliesCanvas })),
)

interface SceneCanvasProps {
  scrollProgressRef: RefObject<number>
  isLight?: boolean
  world?: ThemeWorld
}

export function SceneCanvas({
  scrollProgressRef,
  isLight = false,
  world = 'galaxy',
}: SceneCanvasProps) {
  const { prefersReducedMotion, isCompactViewport, lowPower } = useReducedMotion()
  const [canvasReady, setCanvasReady] = useState(false)

  const envPrimaryColor =
    world === 'galaxy'
      ? '#d8b4fe'
      : world === 'jungle'
        ? '#6ee7b7'
        : world === 'ocean'
          ? '#7dd3fc'
          : '#bae6fd'

  const envSecondaryColor =
    world === 'galaxy'
      ? '#7dd3fc'
      : world === 'jungle'
        ? '#5eead4'
        : world === 'ocean'
          ? '#2dd4bf'
          : '#c7d2fe'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg-canvas)] transition-colors duration-300"
    >
      {/* World-Specific Ambient Atmospheric Backdrops */}
      {world === 'liquid-glass' && (
        <>
          <div
            className={`aurora-orb absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full blur-[130px] transition-opacity duration-500 ${
              isLight ? 'opacity-28' : 'opacity-25'
            }`}
            style={{ background: 'radial-gradient(circle, var(--accent-primary), transparent 70%)' }}
          />
          <div
            className={`aurora-orb-delayed absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full blur-[140px] transition-opacity duration-500 ${
              isLight ? 'opacity-22' : 'opacity-20'
            }`}
            style={{
              background: `radial-gradient(circle, ${isLight ? '#fbcfe8' : '#f9a8d4'}, transparent 70%)`,
            }}
          />
          <div
            className={`aurora-orb absolute -bottom-44 left-1/4 h-[34rem] w-[34rem] rounded-full blur-[140px] transition-opacity duration-500 ${
              isLight ? 'opacity-22' : 'opacity-20'
            }`}
            style={{
              background: `radial-gradient(circle, ${isLight ? '#a7f3d0' : '#6ee7b7'}, transparent 70%)`,
            }}
          />
          <div
            className={`aurora-orb-delayed absolute -bottom-48 right-0 h-[36rem] w-[36rem] rounded-full blur-[130px] transition-opacity duration-500 ${
              isLight ? 'opacity-24' : 'opacity-22'
            }`}
            style={{ background: 'radial-gradient(circle, var(--accent-secondary), transparent 70%)' }}
          />
        </>
      )}

      {world === 'galaxy' && (
        <>
          <div
            className={`aurora-orb absolute -top-44 -left-24 h-[38rem] w-[38rem] rounded-full blur-[145px] transition-opacity duration-500 ${
              isLight ? 'opacity-28' : 'opacity-32'
            }`}
            style={{
              background: `radial-gradient(circle, ${isLight ? '#c4b5fd' : '#9333ea'}, transparent 70%)`,
            }}
          />
          <div
            className={`aurora-orb-delayed absolute top-1/4 -right-28 h-[34rem] w-[34rem] rounded-full blur-[145px] transition-opacity duration-500 ${
              isLight ? 'opacity-24' : 'opacity-26'
            }`}
            style={{
              background: `radial-gradient(circle, ${isLight ? '#7dd3fc' : '#0284c7'}, transparent 70%)`,
            }}
          />
          <div
            className={`aurora-orb absolute -bottom-40 left-1/3 h-[34rem] w-[34rem] rounded-full blur-[140px] transition-opacity duration-500 ${
              isLight ? 'opacity-22' : 'opacity-22'
            }`}
            style={{
              background: `radial-gradient(circle, ${isLight ? '#fbcfe8' : '#db2777'}, transparent 70%)`,
            }}
          />
        </>
      )}

      {world === 'jungle' && (
        <Suspense fallback={null}>
          <JungleBackdrop isLight={isLight} />
        </Suspense>
      )}

      {world === 'ocean' && (
        <Suspense fallback={null}>
          <OceanBackdrop isLight={isLight} />
        </Suspense>
      )}

      <div
        className={`relative z-[2] h-full w-full transition-opacity duration-700 ${
          canvasReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Canvas
          dpr={lowPower ? [1, 1.25] : [1, 1.75]}
          camera={{ position: [0, 0, 7.6], fov: isCompactViewport ? 48 : 42 }}
          eventSource={typeof document !== 'undefined' ? document.documentElement : undefined}
          eventPrefix="client"
          onCreated={() => setCanvasReady(true)}
          gl={{
            antialias: !lowPower,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <ambientLight intensity={isLight ? 1.1 : 0.72} color={isLight ? '#ffffff' : '#e2e8f0'} />
          <directionalLight
            position={[5, 6, 6]}
            intensity={isLight ? 1.6 : 1.35}
            color={envPrimaryColor}
          />
          <directionalLight
            position={[-5, -3, 4]}
            intensity={isLight ? 1.0 : 0.85}
            color={envSecondaryColor}
          />

          {/* Local studio lightformers for authentic glass reflections */}
          <Environment resolution={128}>
            <group rotation={[-Math.PI / 4, 0, 0]}>
              <Lightformer
                form="ring"
                intensity={isLight ? 3.0 : 2.4}
                color={envPrimaryColor}
                scale={[8, 8, 1]}
                position={[0, 4, -4]}
              />
              <Lightformer
                form="rect"
                intensity={isLight ? 2.0 : 1.6}
                color={envSecondaryColor}
                scale={[10, 3, 1]}
                position={[-6, 1, 2]}
                target={[0, 0, 0]}
              />
              <Lightformer
                form="rect"
                intensity={isLight ? 1.8 : 1.2}
                color="#f8fafc"
                scale={[8, 2, 1]}
                position={[6, -2, 3]}
                target={[0, 0, 0]}
              />
            </group>
          </Environment>

          <Suspense fallback={null}>
            {world === 'liquid-glass' && (
              <HeroObject
                scrollProgressRef={scrollProgressRef}
                reducedMotion={prefersReducedMotion}
                lowPower={lowPower}
                isLight={isLight}
              />
            )}

            {world === 'galaxy' && (
              <GalaxyScene
                scrollProgressRef={scrollProgressRef}
                reducedMotion={prefersReducedMotion}
                lowPower={lowPower}
                isLight={isLight}
                isCompactViewport={isCompactViewport}
              />
            )}

            {world === 'jungle' && (
              <JungleScene
                scrollProgressRef={scrollProgressRef}
                reducedMotion={prefersReducedMotion}
                lowPower={lowPower}
                isLight={isLight}
              />
            )}

            {world === 'ocean' && (
              <OceanScene
                scrollProgressRef={scrollProgressRef}
                reducedMotion={prefersReducedMotion}
                lowPower={lowPower}
                isLight={isLight}
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* Live 60fps Flying Fireflies for Liquid Glass Theme (Behind 3D Sculpture) */}
      {world === 'liquid-glass' && (
        <Suspense fallback={null}>
          <GlassFirefliesCanvas
            isLight={isLight}
            reducedMotion={prefersReducedMotion}
            isCompactViewport={isCompactViewport}
          />
        </Suspense>
      )}

      {/* Live 60fps Rainforest Rain Streaks, Splashes & Fireflies */}
      {world === 'jungle' && (
        <Suspense fallback={null}>
          <JungleRainCanvas
            isLight={isLight}
            reducedMotion={prefersReducedMotion}
            isCompactViewport={isCompactViewport}
          />
        </Suspense>
      )}

      {/* Live 60fps Swimming Ocean Fish & Rising Air Bubbles */}
      {world === 'ocean' && (
        <Suspense fallback={null}>
          <OceanLifeCanvas
            isLight={isLight}
            reducedMotion={prefersReducedMotion}
            isCompactViewport={isCompactViewport}
          />
        </Suspense>
      )}
    </div>
  )
}
