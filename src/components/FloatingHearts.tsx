import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { HeartIcon, SparkleIcon, StarIcon } from './Shapes'

type Kind = 'heart' | 'star' | 'sparkle' | 'yarn'

interface Bit {
  kind: Kind
  left: number
  size: number
  dur: number
  delay: number
  sway: number
  rot: number
  top: number
  color: string
  opacity: number
}

const COLORS = ['#f29bb1', '#d99baa', '#cdb8ea', '#ffc9b0', '#f8b7c8']

/** Small deterministic PRNG so the decoration is stable between renders. */
function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function YarnBit({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill={color} />
      <g fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round">
        <path d="M4 9c5 3 11 3 16 0" />
        <path d="M3.5 14c5 3 12 3 17 0" />
        <path d="M8 3.5c3 5 3 12 0 17" />
      </g>
    </svg>
  )
}

/** Gently drifting hearts, stars and tiny yarn balls. Pure CSS animation, so it stays light on phones. */
export function FloatingHearts({ seed = 1, count = 13 }: { seed?: number; count?: number }) {
  const bits = useMemo<Bit[]>(() => {
    const r = mulberry(seed * 977)
    const kinds: Kind[] = ['heart', 'heart', 'heart', 'star', 'sparkle', 'yarn']
    return Array.from({ length: count }, () => ({
      kind: kinds[Math.floor(r() * kinds.length)],
      left: 3 + r() * 92,
      size: 12 + r() * 16,
      dur: 18 + r() * 16,
      delay: -r() * 30,
      sway: (r() - 0.5) * 80,
      rot: (r() - 0.5) * 80,
      top: 8 + r() * 80,
      color: COLORS[Math.floor(r() * COLORS.length)],
      opacity: 0.45 + r() * 0.35,
    }))
  }, [seed, count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bits.map((b, i) => {
        const style = {
          left: `${b.left}%`,
          width: b.size,
          height: b.size,
          color: b.color,
          '--dur': `${b.dur}s`,
          '--delay': `${b.delay}s`,
          '--sway': `${b.sway}px`,
          '--rot': `${b.rot}deg`,
          '--top': `${b.top}%`,
          '--o': b.opacity,
        } as CSSProperties
        return (
          <span key={i} className="drift" style={style}>
            {b.kind === 'heart' && <HeartIcon width="100%" height="100%" />}
            {b.kind === 'star' && <StarIcon width="100%" height="100%" />}
            {b.kind === 'sparkle' && <SparkleIcon width="100%" height="100%" />}
            {b.kind === 'yarn' && <YarnBit color={b.color} />}
          </span>
        )
      })}
    </div>
  )
}
