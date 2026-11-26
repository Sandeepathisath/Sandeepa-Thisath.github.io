interface OceanBackdropProps {
  isLight?: boolean
}

export function OceanBackdrop({ isLight = false }: OceanBackdropProps) {
  const kelpDark = isLight ? '#0f766e' : '#0e7490'
  const kelpMid = isLight ? '#0284c7' : '#0891b2'
  const kelpBright = isLight ? '#14b8a6' : '#2dd4bf'
  const abyssBottom = isLight ? '#0369a1' : '#021524'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Deep Oceanic & Seafoam Ambient Color Washes */}
      <div
        className={`aurora-orb absolute -top-40 -left-24 h-[36rem] w-[36rem] rounded-full blur-[135px] transition-opacity duration-500 ${
          isLight ? 'opacity-28' : 'opacity-30'
        }`}
        style={{
          background: `radial-gradient(circle, ${isLight ? '#38bdf8' : '#0284c7'}, transparent 70%)`,
        }}
      />
      <div
        className={`aurora-orb-delayed absolute top-1/4 -right-24 h-[34rem] w-[34rem] rounded-full blur-[140px] transition-opacity duration-500 ${
          isLight ? 'opacity-24' : 'opacity-24'
        }`}
        style={{
          background: `radial-gradient(circle, ${isLight ? '#2dd4bf' : '#0d9488'}, transparent 70%)`,
        }}
      />
      <div
        className={`aurora-orb absolute -bottom-44 left-1/3 h-[36rem] w-[36rem] rounded-full blur-[145px] transition-opacity duration-500 ${
          isLight ? 'opacity-22' : 'opacity-26'
        }`}
        style={{
          background: `radial-gradient(circle, ${isLight ? '#7dd3fc' : '#0369a1'}, transparent 70%)`,
        }}
      />

      {/* Sunlit Water Surface Light Rays Filtering Down */}
      <div className="absolute inset-x-0 top-0 h-[62vh] overflow-hidden">
        <div
          className={`ray-shimmer absolute -top-12 left-[14%] h-full w-32 origin-top blur-2xl ${
            isLight ? 'opacity-30' : 'opacity-16'
          }`}
          style={{
            background: `linear-gradient(to bottom, ${isLight ? 'rgba(255,255,255,0.85)' : 'rgba(125,211,252,0.45)'}, transparent 85%)`,
          }}
        />
        <div
          className={`ray-shimmer absolute -top-16 left-[46%] h-full w-44 origin-top blur-3xl ${
            isLight ? 'opacity-26' : 'opacity-14'
          }`}
          style={{
            background: `linear-gradient(to bottom, ${isLight ? 'rgba(186,230,253,0.85)' : 'rgba(56,189,248,0.42)'}, transparent 88%)`,
            animationDelay: '-4s',
          }}
        />
        <div
          className={`ray-shimmer absolute -top-10 right-[18%] h-full w-28 origin-top blur-2xl ${
            isLight ? 'opacity-24' : 'opacity-14'
          }`}
          style={{
            background: `linear-gradient(to bottom, ${isLight ? 'rgba(153,246,228,0.75)' : 'rgba(45,212,191,0.38)'}, transparent 82%)`,
            animationDelay: '-8s',
          }}
        />
      </div>

      {/* Swaying Seaweed & Kelp Clusters (Left Side) */}
      <svg
        viewBox="0 0 260 360"
        fill="none"
        className={`kelp-sway absolute -left-4 bottom-0 h-52 w-40 transition-opacity duration-500 sm:h-72 sm:w-56 ${
          isLight ? 'opacity-20' : 'opacity-30'
        }`}
      >
        <path
          d="M36 360 C18 290 56 230 34 155 C16 95 48 45 64 12 C68 65 44 105 64 168 C84 232 48 295 62 360 Z"
          fill={kelpDark}
          fillOpacity="0.72"
        />
        <path
          d="M84 360 C68 300 105 245 86 182 C70 132 96 86 110 56 C114 104 94 142 110 198 C126 254 92 302 106 360 Z"
          fill={kelpBright}
          fillOpacity="0.58"
        />
        <path
          d="M132 360 C120 315 148 272 135 224 C124 185 144 152 154 128 C158 164 142 195 154 238 C166 280 140 318 150 360 Z"
          fill={kelpMid}
          fillOpacity="0.5"
        />
      </svg>

      {/* Swaying Seaweed & Kelp Clusters (Right Side) */}
      <svg
        viewBox="0 0 260 360"
        fill="none"
        className={`kelp-sway-delayed absolute -right-4 bottom-0 h-52 w-40 transition-opacity duration-500 sm:h-72 sm:w-56 ${
          isLight ? 'opacity-20' : 'opacity-30'
        }`}
      >
        <path
          d="M224 360 C242 290 204 230 226 155 C244 95 212 45 196 12 C192 65 216 105 196 168 C176 232 212 295 198 360 Z"
          fill={kelpDark}
          fillOpacity="0.72"
        />
        <path
          d="M174 360 C190 300 153 245 172 182 C188 132 162 86 148 56 C144 104 164 142 148 198 C132 254 166 302 152 360 Z"
          fill={kelpBright}
          fillOpacity="0.58"
        />
        <path
          d="M126 360 C138 315 110 272 123 224 C134 185 114 152 104 128 C100 164 116 195 104 238 C92 280 118 318 108 360 Z"
          fill={kelpMid}
          fillOpacity="0.5"
        />
      </svg>

      {/* Subtle Deep Ocean Seabed / Coral Contour Along Bottom */}
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className={`absolute inset-x-0 bottom-0 h-28 w-full transition-opacity duration-500 sm:h-36 ${
          isLight ? 'opacity-18' : 'opacity-34'
        }`}
      >
        <defs>
          <linearGradient id="oceanFloorFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={kelpMid} stopOpacity="0.1" />
            <stop offset="100%" stopColor={abyssBottom} stopOpacity="0.92" />
          </linearGradient>
        </defs>
        <path
          d="M0 145 Q240 95 480 138 T960 124 T1440 135 L1440 200 L0 200 Z"
          fill={kelpDark}
          fillOpacity="0.35"
        />
        <path
          d="M0 165 C180 135 340 180 540 154 C740 128 910 175 1120 150 C1280 132 1380 160 1440 148 L1440 200 L0 200 Z"
          fill="url(#oceanFloorFade)"
        />
      </svg>
    </div>
  )
}
