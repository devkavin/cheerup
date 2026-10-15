import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react'
import { HEART_PATH, SPARKLE_PATH } from './Shapes'

export type BurstKind = 'hearts' | 'sparkle' | 'confetti' | 'rain'

export interface BurstOptions {
  kind?: BurstKind
  count?: number
}

type Origin =
  | HTMLElement
  | { x: number; y: number }
  | { clientX: number; clientY: number; currentTarget: EventTarget | null }
  | null

interface BurstApi {
  burst: (origin: Origin, options?: BurstOptions) => void
  toast: (message: string) => void
}

const BurstContext = createContext<BurstApi | null>(null)

export function useBurst(): BurstApi {
  const ctx = useContext(BurstContext)
  if (!ctx) throw new Error('useBurst must be used inside <BurstProvider>')
  return ctx
}

type Shape = 'heart' | 'sparkle' | 'dot' | 'ribbon'

interface Particle {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  size: number
  rot: number
  color: string
  shape: Shape
  delay: number
  duration: number
  gravity: boolean
  ease: 'easeOut' | 'linear'
}

const HEART_COLORS = ['#f29bb1', '#e57f9b', '#f8b7c8', '#d99baa', '#ffb8a8']
const SPARKLE_COLORS = ['#ffffff', '#ffe7a8', '#f8b7c8', '#e8dff5']
const CONFETTI_COLORS = ['#f29bb1', '#e8dff5', '#ffd2b8', '#fff3c4', '#cdb8ea', '#ffffff']
const MAX_PARTICLES = 90

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function resolveOrigin(origin: Origin): { x: number; y: number } {
  if (!origin) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  if (origin instanceof HTMLElement) {
    const r = origin.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  if ('x' in origin) return { x: origin.x, y: origin.y }
  // keyboard-triggered clicks report 0,0, so fall back to the element centre
  if (origin.clientX === 0 && origin.clientY === 0 && origin.currentTarget instanceof HTMLElement) {
    const r = origin.currentTarget.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return { x: origin.clientX, y: origin.clientY }
}

let nextId = 1

function makeParticles(kind: BurstKind, count: number, at: { x: number; y: number }, reduced: boolean): Particle[] {
  const out: Particle[] = []
  const w = window.innerWidth
  const h = window.innerHeight
  const damp = reduced ? 0.12 : 1
  const n = reduced ? Math.min(count, 3) : count

  for (let i = 0; i < n; i++) {
    const base = { id: nextId++, gravity: false, ease: 'easeOut' as const, delay: 0 }
    if (kind === 'hearts') {
      const a = (rand(-155, -25) * Math.PI) / 180
      const d = rand(50, 125) * damp
      out.push({
        ...base,
        x: at.x,
        y: at.y,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d,
        size: rand(12, 24),
        rot: rand(-35, 35),
        color: pick(HEART_COLORS),
        shape: 'heart',
        delay: rand(0, 0.12),
        duration: rand(0.9, 1.5),
      })
    } else if (kind === 'sparkle') {
      const a = rand(0, Math.PI * 2)
      const d = rand(26, 68) * damp
      out.push({
        ...base,
        x: at.x,
        y: at.y,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d,
        size: rand(8, 16),
        rot: rand(-60, 60),
        color: pick(SPARKLE_COLORS),
        shape: 'sparkle',
        delay: rand(0, 0.08),
        duration: rand(0.55, 0.95),
      })
    } else if (kind === 'confetti') {
      const a = (rand(-165, -15) * Math.PI) / 180
      const d = rand(70, 150) * damp
      const isRibbon = Math.random() > 0.5
      out.push({
        ...base,
        x: at.x,
        y: at.y,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d,
        size: isRibbon ? rand(10, 15) : rand(6, 10),
        rot: rand(-300, 300),
        color: pick(CONFETTI_COLORS),
        shape: isRibbon ? 'ribbon' : 'dot',
        gravity: !reduced,
        delay: rand(0, 0.08),
        duration: rand(1.1, 1.7),
      })
    } else {
      // rain of hearts from the top of the screen
      out.push({
        ...base,
        x: rand(10, w - 10),
        y: reduced ? rand(h * 0.1, h * 0.5) : -30,
        dx: rand(-30, 30) * damp,
        dy: reduced ? 0 : h + 80,
        size: rand(12, 26),
        rot: rand(-40, 40),
        color: pick(HEART_COLORS),
        shape: 'heart',
        ease: 'linear',
        delay: rand(0, 1.1),
        duration: rand(1.8, 2.8),
      })
    }
  }
  return out
}

function ParticleShape({ shape }: { shape: Shape }) {
  if (shape === 'heart')
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <path d={HEART_PATH} fill="currentColor" />
      </svg>
    )
  if (shape === 'sparkle')
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <path d={SPARKLE_PATH} fill="currentColor" />
      </svg>
    )
  if (shape === 'ribbon') return <div style={{ width: '45%', height: '100%', background: 'currentColor', borderRadius: 3, margin: '0 auto' }} />
  return <div style={{ width: '100%', height: '100%', background: 'currentColor', borderRadius: '50%' }} />
}

function ParticleView({ p, onDone }: { p: Particle; onDone: (id: number) => void }) {
  const base = { delay: p.delay, duration: p.duration }
  const transition: Transition = {
    opacity: { ...base, times: [0, 0.12, 0.7, 1] },
    scale: { ...base, times: [0, 0.2, 0.75, 1] },
    x: { ...base, ease: p.ease },
    y: p.gravity ? { ...base, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] } : { ...base, ease: p.ease },
    rotate: { ...base, ease: 'linear' },
  }
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        width: p.size,
        height: p.size,
        marginLeft: -p.size / 2,
        marginTop: -p.size / 2,
        color: p.color,
      }}
      initial={{ opacity: 0, scale: 0.2, x: 0, y: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.2, 1, 1, 0.7],
        x: p.dx,
        y: p.gravity ? [0, p.dy, p.dy + 90] : p.dy,
        rotate: p.rot,
      }}
      transition={transition}
      onAnimationComplete={() => onDone(p.id)}
    >
      <ParticleShape shape={p.shape} />
    </motion.div>
  )
}

export function BurstProvider({ children }: { children: ReactNode }) {
  const reduced = !!useReducedMotion()
  const [particles, setParticles] = useState<Particle[]>([])
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const burst = useCallback(
    (origin: Origin, options: BurstOptions = {}) => {
      const { kind = 'hearts', count = 8 } = options
      const fresh = makeParticles(kind, count, resolveOrigin(origin), reduced)
      setParticles((prev) => [...prev, ...fresh].slice(-MAX_PARTICLES))
    },
    [reduced],
  )

  const toast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current)
    setToastMsg({ id: nextId++, text })
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 4200)
  }, [])

  const remove = useCallback((id: number) => setParticles((prev) => prev.filter((p) => p.id !== id)), [])

  const api = useMemo(() => ({ burst, toast }), [burst, toast])

  return (
    <BurstContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <ParticleView key={p.id} p={p} onDone={remove} />
        ))}
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-[4.4rem] z-[70] flex justify-center px-6" role="status" aria-live="polite">
        <AnimatePresence>
          {toastMsg && (
            <motion.p
              key={toastMsg.id}
              initial={{ opacity: 0, y: -12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className="soft-shadow max-w-xs rounded-full border-2 border-white bg-cream px-5 py-2.5 text-center text-[0.95rem] font-medium leading-snug text-berry-deep"
            >
              {toastMsg.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </BurstContext.Provider>
  )
}
