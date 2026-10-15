import { useId, type ReactNode } from 'react'

/** A ball of pink yarn, centred on (0,0) with radius `r`. Render inside an <svg>. */
export function YarnBallArt({ r = 28, color = '#f29bb1', dark = '#d4708c' }: { r?: number; color?: string; dark?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <g>
      <defs>
        <clipPath id={`ball-${id}`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <ellipse cx="0" cy={r + 3} rx={r * 0.9} ry={r * 0.16} fill="#b5566f" opacity="0.18" />
      <circle r={r} fill={color} stroke={dark} strokeWidth="2.2" />
      <g clipPath={`url(#ball-${id})`} fill="none" strokeLinecap="round">
        {[0, 38, 76, 118, 152].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d={`M${-r} ${-r * 0.35} Q0 ${r * 0.45} ${r} ${-r * 0.3}`} stroke={dark} strokeOpacity="0.6" strokeWidth="2" />
            <path d={`M${-r} ${-r * 0.42} Q0 ${r * 0.38} ${r} ${-r * 0.37}`} stroke="#fff" strokeOpacity="0.4" strokeWidth="1.3" />
          </g>
        ))}
        <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.28} ry={r * 0.16} fill="#fff" opacity="0.35" stroke="none" transform={`rotate(-30 ${-r * 0.35} ${-r * 0.4})`} />
      </g>
    </g>
  )
}

/** Standalone wrapper so the yarn ball can be dropped into HTML layouts. */
export function YarnBallFrame({ size = 56, children }: { size?: number; children?: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="-34 -34 68 72" aria-hidden="true" style={{ overflow: 'visible' }}>
      {children ?? <YarnBallArt />}
    </svg>
  )
}
