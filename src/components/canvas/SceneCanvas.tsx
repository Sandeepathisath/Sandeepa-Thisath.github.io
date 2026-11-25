import { Suspense, useState } from 'react'
import type { RefObject } from 'react'
import { Environment, Lightformer } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroObject } from './HeroObject'
import { Particles } from './Particles'

interface SceneCanvasProps {
  scrollProgressRef: RefObject<number>
  isLight?: boolean
}

export function SceneCanvas({ scrollProgressRef, isLight = false }: SceneCanvasProps) {
  const { prefersReducedMotion, isCompactViewport, lowPower } = useReducedMotion()
  const [canvasReady, setCanvasReady] = useState(false)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--bg-canvas)] transition-colors duration-300"
    >
      {/* Eye-friendly soft multi-tone ambient color washes behind the 3D scene */}
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

      <div
        className={`h-full w-full transition-opacity duration-700 ${
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
          <ambientLight intensity={isLight ? 1.1 : 0.7} color={isLight ? '#ffffff' : '#e2e8f0'} />
          <directionalLight
            position={[5, 6, 6]}
            intensity={isLight ? 1.6 : 1.35}
            color="#e0f2fe"
          />
          <directionalLight
            position={[-5, -3, 4]}
            intensity={isLight ? 1.0 : 0.8}
            color={isLight ? '#e0e7ff' : '#c7d2fe'}
          />

          {/* Local studio lightformers for authentic Apple glass reflections */}
          <Environment resolution={128}>
            <group rotation={[-Math.PI / 4, 0, 0]}>
              <Lightformer
                form="ring"
                intensity={isLight ? 3.0 : 2.4}
                color="#bae6fd"
                scale={[8, 8, 1]}
                position={[0, 4, -4]}
              />
              <Lightformer
                form="rect"
                intensity={isLight ? 2.0 : 1.6}
                color="#c7d2fe"
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
            <Particles
              count={isCompactViewport ? 160 : 320}
              reducedMotion={prefersReducedMotion}
              isLight={isLight}
              scrollProgressRef={scrollProgressRef}
            />
            <HeroObject
              scrollProgressRef={scrollProgressRef}
              reducedMotion={prefersReducedMotion}
              lowPower={lowPower}
              isLight={isLight}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
