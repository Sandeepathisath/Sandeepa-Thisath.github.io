interface JungleBackdropProps {
  isLight?: boolean
}

export function JungleBackdrop({ isLight = false }: JungleBackdropProps) {
  const leafDark = isLight ? '#047857' : '#065f46'
  const leafMid = isLight ? '#059669' : '#10b981'
  const leafBright = isLight ? '#10b981' : '#34d399'
  const leafDeep = isLight ? '#064e3b' : '#022c22'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Soft Botanical Emerald & Rain-Mist Ambient Washes */}
      <div
        className={`aurora-orb absolute -top-36 -left-24 h-[34rem] w-[34rem] rounded-full blur-[130px] transition-opacity duration-500 ${
          isLight ? 'opacity-28' : 'opacity-28'
        }`}
        style={{
          background: `radial-gradient(circle, ${leafBright}, transparent 70%)`,
        }}
      />
      <div
        className={`aurora-orb-delayed absolute top-1/4 -right-28 h-[32rem] w-[32rem] rounded-full blur-[140px] transition-opacity duration-500 ${
          isLight ? 'opacity-22' : 'opacity-22'
        }`}
        style={{
          background: `radial-gradient(circle, ${isLight ? '#38bdf8' : '#0ea5e9'}, transparent 70%)`,
        }}
      />
      <div
        className={`aurora-orb absolute -bottom-44 left-1/4 h-[36rem] w-[36rem] rounded-full blur-[140px] transition-opacity duration-500 ${
          isLight ? 'opacity-26' : 'opacity-26'
        }`}
        style={{
          background: `radial-gradient(circle, ${leafMid}, transparent 70%)`,
        }}
      />

      {/* Misty Side Woodland Tree Trunks & Canopy Boughs (Tablet/Desktop Margins) */}
      <svg
        viewBox="0 0 260 900"
        preserveAspectRatio="none"
        fill="none"
        className={`hidden md:block absolute left-0 inset-y-0 h-full w-44 transition-opacity duration-500 lg:w-56 ${
          isLight ? 'opacity-16' : 'opacity-24'
        }`}
      >
        <path
          d="M0 0 H68 C52 190 48 380 62 610 C70 730 82 820 96 900 H0 Z"
          fill={leafDeep}
          fillOpacity="0.85"
        />
        <path
          d="M36 0 C48 95 72 175 128 225 C84 195 54 190 36 220 Z"
          fill={leafDark}
          fillOpacity="0.6"
        />
        <path
          d="M0 240 C65 255 128 292 178 345 C120 322 68 320 0 342 Z"
          fill={leafMid}
          fillOpacity="0.45"
        />
      </svg>

      <svg
        viewBox="0 0 260 900"
        preserveAspectRatio="none"
        fill="none"
        className={`hidden md:block absolute right-0 inset-y-0 h-full w-44 transition-opacity duration-500 lg:w-56 ${
          isLight ? 'opacity-16' : 'opacity-24'
        }`}
      >
        <path
          d="M260 0 H192 C208 190 212 380 198 610 C190 730 178 820 164 900 H260 Z"
          fill={leafDeep}
          fillOpacity="0.85"
        />
        <path
          d="M224 0 C212 95 188 175 132 225 C176 195 206 190 224 220 Z"
          fill={leafDark}
          fillOpacity="0.6"
        />
        <path
          d="M260 270 C195 285 132 322 82 375 C140 352 192 350 260 372 Z"
          fill={leafMid}
          fillOpacity="0.45"
        />
      </svg>

      {/* Top-Left Enriched Canopy Fronds, Grass Blades & Hanging Vines */}
      <svg
        viewBox="0 0 460 390"
        fill="none"
        className={`frond-sway absolute -left-8 -top-6 h-56 w-64 transition-opacity duration-500 sm:h-72 sm:w-88 ${
          isLight ? 'opacity-22' : 'opacity-32'
        }`}
      >
        {/* Distant wide palm fronds */}
        <path
          d="M-12 -10 C95 -4 198 28 295 82 C215 62 142 58 62 72 C135 95 205 135 268 188 C192 156 122 145 45 158 C105 185 162 222 208 272 C135 232 65 212 -12 220 Z"
          fill={leafDark}
          fillOpacity="0.58"
        />
        {/* Crisp layered palm & wild grass fronds */}
        <path
          d="M-8 14 C82 26 168 62 232 126 C164 98 98 92 28 110 C78 134 128 168 172 218 C110 186 52 178 -8 192 Z"
          fill={leafMid}
          fillOpacity="0.72"
        />
        {/* Sharp canopy grass blades */}
        <path
          d="M12 -4 Q78 88 122 198 Q72 115 2 35 Z"
          fill={leafBright}
          fillOpacity="0.65"
        />
        <path
          d="M95 -8 Q185 52 256 142 Q178 78 75 18 Z"
          fill={leafBright}
          fillOpacity="0.5"
        />
        {/* Cascading Hanging Rainforest Vines */}
        <path
          d="M62 0 Q54 115 70 250"
          stroke={leafMid}
          strokeWidth="2"
          strokeOpacity="0.55"
        />
        <path
          d="M138 0 Q146 95 130 205"
          stroke={leafBright}
          strokeWidth="1.6"
          strokeOpacity="0.45"
        />
        <ellipse cx="58" cy="148" rx="9" ry="4" transform="rotate(-28 58 148)" fill={leafBright} fillOpacity="0.65" />
        <ellipse cx="70" cy="196" rx="8" ry="3.5" transform="rotate(24 70 196)" fill={leafMid} fillOpacity="0.65" />
        <ellipse cx="66" cy="238" rx="7" ry="3" transform="rotate(-18 66 238)" fill={leafBright} fillOpacity="0.6" />
        <ellipse cx="141" cy="128" rx="8" ry="3.5" transform="rotate(22 141 128)" fill={leafBright} fillOpacity="0.55" />
        <ellipse cx="131" cy="176" rx="7" ry="3" transform="rotate(-24 131 176)" fill={leafMid} fillOpacity="0.55" />
      </svg>

      {/* Top-Right Enriched Canopy Fronds, Grass Blades & Hanging Vines */}
      <svg
        viewBox="0 0 460 390"
        fill="none"
        className={`frond-sway-right absolute -right-8 -top-6 h-56 w-64 transition-opacity duration-500 sm:h-72 sm:w-88 ${
          isLight ? 'opacity-22' : 'opacity-32'
        }`}
      >
        {/* Distant wide palm fronds */}
        <path
          d="M472 -10 C365 -4 262 28 165 82 C245 62 318 58 398 72 C325 95 255 135 192 188 C268 156 338 145 415 158 C355 185 298 222 252 272 C325 232 395 212 472 220 Z"
          fill={leafDark}
          fillOpacity="0.58"
        />
        {/* Crisp layered palm & wild grass fronds */}
        <path
          d="M468 14 C378 26 292 62 228 126 C296 98 362 92 432 110 C382 134 332 168 288 218 C350 186 408 178 468 192 Z"
          fill={leafMid}
          fillOpacity="0.72"
        />
        {/* Sharp canopy grass blades */}
        <path
          d="M448 -4 Q382 88 338 198 Q388 115 458 35 Z"
          fill={leafBright}
          fillOpacity="0.65"
        />
        <path
          d="M365 -8 Q275 52 204 142 Q282 78 385 18 Z"
          fill={leafBright}
          fillOpacity="0.5"
        />
        {/* Cascading Hanging Rainforest Vines */}
        <path
          d="M398 0 Q406 115 390 255"
          stroke={leafMid}
          strokeWidth="2"
          strokeOpacity="0.55"
        />
        <path
          d="M320 0 Q312 100 326 212"
          stroke={leafBright}
          strokeWidth="1.6"
          strokeOpacity="0.45"
        />
        <ellipse cx="402" cy="148" rx="9" ry="4" transform="rotate(28 402 148)" fill={leafBright} fillOpacity="0.65" />
        <ellipse cx="390" cy="198" rx="8" ry="3.5" transform="rotate(-24 390 198)" fill={leafMid} fillOpacity="0.65" />
        <ellipse cx="394" cy="242" rx="7" ry="3" transform="rotate(18 394 242)" fill={leafBright} fillOpacity="0.6" />
        <ellipse cx="319" cy="132" rx="8" ry="3.5" transform="rotate(-22 319 132)" fill={leafBright} fillOpacity="0.55" />
        <ellipse cx="328" cy="182" rx="7" ry="3" transform="rotate(24 328 182)" fill={leafMid} fillOpacity="0.55" />
      </svg>

      {/* Bottom Lush Jungle Ferns, Tall Wild Grass Tufts & Misty Ridge */}
      <svg
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        className={`kelp-sway absolute inset-x-0 bottom-0 h-36 w-full transition-opacity duration-500 sm:h-48 ${
          isLight ? 'opacity-24' : 'opacity-40'
        }`}
      >
        <defs>
          <linearGradient id="jungleMistFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={leafMid} stopOpacity="0.12" />
            <stop offset="100%" stopColor={leafDeep} stopOpacity="0.92" />
          </linearGradient>
        </defs>
        {/* Distant misty ridge */}
        <path
          d="M0 175 Q220 112 440 162 T900 145 T1220 164 T1440 135 L1440 260 L0 260 Z"
          fill={leafDark}
          fillOpacity="0.42"
        />
        {/* Wild jungle grass blades & ferns left/center/right */}
        <path
          d="M0 260 L0 185 Q42 105 78 190 Q98 92 135 192 Q165 128 192 204 Q245 142 280 212 Q355 170 420 205 Q495 130 538 205 Q585 152 630 215 Q740 175 835 208 Q905 122 948 202 Q990 148 1035 210 Q1145 162 1215 198 Q1258 98 1305 192 Q1348 112 1388 188 Q1415 135 1440 175 L1440 260 Z"
          fill={leafMid}
          fillOpacity="0.48"
        />
        {/* Foreground lush ridge */}
        <path
          d="M0 208 C140 172 280 220 440 192 C600 164 740 215 920 188 C1100 160 1260 210 1440 182 L1440 260 L0 260 Z"
          fill="url(#jungleMistFade)"
        />
      </svg>
    </div>
  )
}
