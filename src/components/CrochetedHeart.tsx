import { memo } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { YarnBallArt } from './YarnBall'

/* ------------------------------------------------------------------ *
 * Geometry. The heart is a parametric outline; stitches are placed on a
 * brick-pattern grid and kept only if they sit comfortably inside it.
 * One crochet "row" per tap, bottom to top.
 * ------------------------------------------------------------------ */

export const STAGE_W = 320
export const STAGE_H = 220
const CX = 120
const CY = 92
const K = 6

type Pt = [number, number]

const OUTLINE: Pt[] = Array.from({ length: 240 }, (_, i) => {
  const t = (i / 240) * Math.PI * 2
  const x = 16 * Math.sin(t) ** 3
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  return [CX + K * x, CY - K * y] as Pt
})

function inside(px: number, py: number): boolean {
  let c = false
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i]
    const [xj, yj] = OUTLINE[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

function distToEdge(px: number, py: number): number {
  let best = Infinity
  for (let i = 0; i < OUTLINE.length; i++) {
    const [ax, ay] = OUTLINE[i]
    const [bx, by] = OUTLINE[(i + 1) % OUTLINE.length]
    const dx = bx - ax
    const dy = by - ay
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)))
  }
  return best
}

export interface Stitch {
  x: number
  y: number
}

const ROW_H = 9.4
const COL_W = 10.4
const BOTTOM = 194
const INSET = 5.2

/** ROWS[0] is the bottom row. Odd rows run right-to-left, like real crochet turning work. */
export const ROWS: Stitch[][] = (() => {
  const rows: Stitch[][] = []
  for (let i = 0; i < 20; i++) {
    const y = BOTTOM - (i + 0.5) * ROW_H
    const row: Stitch[] = []
    for (let k = -12; k <= 12; k++) {
      const x = CX + (k + (i % 2 ? 0.5 : 0)) * COL_W
      if (inside(x, y) && distToEdge(x, y) >= INSET) row.push({ x, y })
    }
    if (row.length) rows.push(row)
  }
  return rows.map((row, r) => (r % 2 === 0 ? row : [...row].reverse()))
})()

export const TOTAL_ROWS = ROWS.length

const OUTLINE_PATH = `M${OUTLINE.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`

/** Where the working yarn / hook sits after `rows` rows are done. */
function hookPoint(rows: number): Stitch {
  if (rows === 0) return { x: CX, y: BOTTOM + 2 }
  const row = ROWS[rows - 1]
  return row[row.length - 1]
}

const BALL = { x: 272, y: 166, r: 28 }
const ROW_COLORS = ['#ee9db2', '#f4afc1', '#f29bb1']

const StitchRow = memo(function StitchRow({ row, r }: { row: Stitch[]; r: number }) {
  const color = ROW_COLORS[r % ROW_COLORS.length]
  return (
    <g style={{ color }}>
      {row.map((s, i) => (
        <g key={i} transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)})`}>
          <g className="stitch-pop" style={{ '--i': i } as CSSProperties}>
            <use href="#yarnStitch" />
          </g>
        </g>
      ))}
    </g>
  )
})

interface CrochetedHeartProps {
  rows: number
  done: boolean
  /** Increment on every tap so the yarn ball can roll. */
  tapKey: number
}

/**
 * The unfinished heart. Each completed row of V-stitches is a real SVG element, so every tap
 * visibly changes the picture, and the yarn thread follows the hook up the heart.
 */
export function CrochetedHeart({ rows, done, tapKey }: CrochetedHeartProps) {
  const hook = hookPoint(rows)
  const progress = rows / TOTAL_ROWS
  const start = { x: BALL.x - 14, y: BALL.y - 22 }
  const thread = `M${start.x} ${start.y} C${start.x - 20} ${start.y - 52} ${hook.x + 64} ${hook.y + 64} ${hook.x} ${hook.y}`

  return (
    <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} className="h-full w-full" style={{ overflow: 'visible' }} role="img" aria-label={`A crocheted heart, ${rows} of ${TOTAL_ROWS} rows stitched`}>
      <defs>
        <g id="yarnStitch">
          <path d="M-5.2 -3.6 L0 4.2 L5.2 -3.6" fill="none" stroke="#a34862" strokeWidth="7.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
          <path d="M-5.2 -4 L0 3.8 L5.2 -4" fill="none" stroke="#c4607c" strokeWidth="6.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-5.2 -4 L0 3.8 L5.2 -4" fill="none" stroke="currentColor" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-4.2 -4.2 L-0.4 2.2" fill="none" stroke="#fff" strokeOpacity="0.65" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4.2 -4.2 L1.2 0.8" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </defs>

      {/* chalk pattern guide */}
      <motion.path
        d={OUTLINE_PATH}
        fill="#fff"
        fillOpacity={0.35}
        stroke="#d99baa"
        strokeWidth={2.2}
        strokeDasharray="3 7"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: done ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* the heart itself */}
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={done ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={done ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      >
        {ROWS.slice(0, rows).map((row, r) => (
          <StitchRow key={r} row={row} r={r} />
        ))}
        {/* finished edge */}
        <motion.path
          d={OUTLINE_PATH}
          fill="none"
          stroke="#e88aa3"
          strokeWidth={6}
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={done ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <motion.path
          d={OUTLINE_PATH}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.55}
          strokeWidth={1.6}
          strokeDasharray="2 6"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      </motion.g>

      {/* working yarn + handcrafted hook */}
      <motion.g initial={false} animate={{ opacity: done ? 0 : 1 }} transition={{ duration: 0.5 }}>
        <motion.path
          fill="none"
          stroke="#e57f9b"
          strokeWidth={3}
          strokeLinecap="round"
          initial={false}
          animate={{ d: thread }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
        <motion.g initial={false} animate={{ x: hook.x, y: hook.y }} transition={{ type: 'spring', stiffness: 140, damping: 15 }}>
          <g transform="rotate(-36)">
            <rect x={0} y={-3} width={52} height={6} rx={3} fill="#e5c8af" stroke="#ad8062" strokeWidth={1.2} />
            <line x1="14" y1="-3" x2="14" y2="3" stroke="#ad8062" strokeWidth={1} opacity="0.4" />
            <line x1="28" y1="-3" x2="28" y2="3" stroke="#ad8062" strokeWidth={1} opacity="0.4" />
            <rect x={48} y={-5.5} width={34} height={11} rx={5.5} fill="#cdb8ea" stroke="#a98fcf" strokeWidth={1.3} />
            <path d="M0 -3 q-3.6 -0.4 -4 -4.8 q1 -1 2.2 -0.6" fill="none" stroke="#9e84c4" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </motion.g>
      </motion.g>

      {/* ball of yarn that shrinks as the heart grows */}
      <g transform={`translate(${BALL.x} ${BALL.y})`}>
        <motion.g style={{ originX: 0.5, originY: 0.5 }} initial={false} animate={{ scale: 1 - progress * 0.32 }}>
          <motion.g
            key={tapKey}
            initial={tapKey ? { rotate: -80, y: -14 } : false}
            animate={{ rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 11 }}
          >
            <YarnBallArt r={BALL.r} />
          </motion.g>
        </motion.g>
      </g>
    </svg>
  )
}
