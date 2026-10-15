import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useAnimationControls, type TargetAndTransition } from 'motion/react'
import { content } from '../content'
import { CrochetedBunny, type BunnyMood } from '../components/CrochetedBunny'
import { PillButton } from '../components/PillButton'
import { SceneShell } from '../components/SceneShell'
import { SpeechBubble } from '../components/SpeechBubble'
import { useBurst } from '../components/BurstProvider'
import { SparkleIcon } from '../components/Shapes'

interface Props {
  onNext: () => void
}

interface Bubble {
  id: number
  text: string
  special: boolean
}

/** Mood for each of the six scripted taps. Taps 7+ pick randomly from RANDOM_MOODS. */
const SCRIPTED_MOODS: BunnyMood[] = ['surprised', 'smug', 'hug', 'sly', 'soft', 'blush']
const RANDOM_MOODS: BunnyMood[] = ['happy', 'surprised', 'smug', 'hug', 'sly']

const REACTIONS: Record<BunnyMood, TargetAndTransition> = {
  idle: {},
  surprised: { y: [0, -30, 0, -8, 0], scaleY: [1, 1.06, 0.93, 1.02, 1], transition: { duration: 0.6 } },
  smug: { rotate: [0, -6, 4, -2, 0], x: [0, -6, 4, 0], transition: { duration: 0.7 } },
  hug: { scaleX: [1, 1.12, 0.94, 1.05, 1], scaleY: [1, 0.9, 1.04, 0.98, 1], transition: { duration: 0.7 } },
  sly: { rotate: [0, 5, -5, 3, 0], y: [0, -8, 0], transition: { duration: 0.6 } },
  soft: { scale: [1, 1.05, 1], y: [0, -6, 0], transition: { duration: 0.9, ease: 'easeInOut' } },
  blush: { y: [0, -14, 0], rotate: [0, -4, 3, 0], scale: [1, 1.06, 1.02], transition: { duration: 1.3, ease: 'easeInOut' } },
  happy: { y: [0, -18, 0, -6, 0], rotate: [0, 5, -5, 0], transition: { duration: 0.65 } },
}

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

/** A big heart-shaped sparkle that pops above the bunny on the sincere tap. */
function HeartSparkle() {
  const sparks = [
    { x: -78, y: -34, s: 18, d: 0.15 },
    { x: 80, y: -42, s: 22, d: 0.3 },
    { x: -52, y: 52, s: 14, d: 0.45 },
    { x: 62, y: 58, s: 16, d: 0.2 },
    { x: 0, y: -84, s: 16, d: 0.35 },
  ]
  return (
    <div className="pointer-events-none absolute left-1/2 top-[34%] z-20 h-0 w-0" aria-hidden="true">
      <motion.div
        className="absolute -left-14 -top-14 h-28 w-28 text-[#f29bb1]"
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: [0, 1.35, 1, 1.1, 0.9], opacity: [0, 1, 1, 1, 0], rotate: [-20, 6, 0, 3, 0], y: [0, 0, -4, -10, -34] }}
        transition={{ duration: 2.4, ease: 'easeOut', times: [0, 0.22, 0.45, 0.75, 1] }}
      >
        <svg viewBox="0 0 24 24" className="h-full w-full drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
          <path
            d="M12 21.2C5.2 15.6 2 11.9 2 7.9 2 4.9 4.3 2.7 7.1 2.7c1.9 0 3.7 1 4.9 2.9 1.2-1.9 3-2.9 4.9-2.9C19.7 2.7 22 4.9 22 7.9c0 4-3.2 7.7-10 13.3z"
            fill="#ffd9e2"
            stroke="#e57f9b"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-[#ffcf70]"
          style={{ left: s.x, top: s.y, marginLeft: -s.s / 2, marginTop: -s.s / 2 }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 1.4, delay: s.d, ease: 'easeInOut' }}
        >
          <SparkleIcon width={s.s} height={s.s} />
        </motion.span>
      ))}
    </div>
  )
}

/** Scene 2: Sir Fluffington III. */
export function BunnyScene({ onNext }: Props) {
  const { burst } = useBurst()
  const controls = useAnimationControls()
  const [pats, setPats] = useState(0)
  const [bubble, setBubble] = useState<Bubble | null>(null)
  const [mood, setMood] = useState<BunnyMood>('idle')
  const patsRef = useRef(0)
  const lastExtra = useRef<string | null>(null)
  const moodTimer = useRef<number | undefined>(undefined)
  const timers = useRef<number[]>([])
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach((t) => window.clearTimeout(t))
      window.clearTimeout(moodTimer.current)
    }
  }, [])

  const handlePat = (e: MouseEvent<HTMLButtonElement>) => {
    const n = patsRef.current + 1
    patsRef.current = n
    setPats(n)

    // Taps 1-6 are the fixed script. Tap 6 is never random.
    let text: string
    let nextMood: BunnyMood
    if (n <= content.bunny.taps.length) {
      text = content.bunny.taps[n - 1]
      nextMood = SCRIPTED_MOODS[n - 1]
    } else {
      const pool = content.bunny.extraTaps.filter((t) => t !== lastExtra.current)
      text = pick(pool)
      lastExtra.current = text
      nextMood = pick(RANDOM_MOODS)
    }
    const special = n === content.bunny.secretTapsNeeded

    setBubble({ id: n, text, special })
    setMood(nextMood)
    controls.start(REACTIONS[nextMood])

    window.clearTimeout(moodTimer.current)
    moodTimer.current = window.setTimeout(() => setMood('idle'), special ? 6500 : 2400)

    burst(e, { kind: 'hearts', count: special ? 16 : 5 })
    if (special) {
      // a second, softer wave of hearts a beat later
      timers.current.push(
        window.setTimeout(() => burst(stageRef.current, { kind: 'hearts', count: 12 }), 450),
        window.setTimeout(() => burst(stageRef.current, { kind: 'sparkle', count: 10 }), 900),
      )
    }
  }

  const blushing = mood === 'blush'
  const sincereReached = pats >= content.bunny.secretTapsNeeded

  return (
    <SceneShell tone="blushlav" seed={7} warm={sincereReached}>
      <header className="space-y-2">
        <h1 className="title text-[1.9rem] sm:text-4xl">{content.bunny.title}</h1>
        <p className="lead mx-auto max-w-[20rem] text-base">{content.bunny.subtitle}</p>
      </header>

      {/* speech zone: fixed height so nothing jumps when the long message arrives */}
      <div className="flex h-[12.5rem] w-full items-end justify-center sm:h-[11rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {bubble ? (
            <SpeechBubble key={bubble.id} special={bubble.special}>
              {bubble.text}
            </SpeechBubble>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="font-hand pb-3 text-[1.9rem] leading-tight text-berry"
            >
              {content.bunny.hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div ref={stageRef} className="relative -mt-1">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-14 -inset-y-8 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(255,205,180,.95), rgba(255,220,205,0))' }}
          initial={false}
          animate={sincereReached ? { opacity: [0.55, 0.95, 0.55], scale: [1, 1.07, 1] } : { opacity: 0 }}
          transition={sincereReached ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        />
        <motion.div animate={controls} style={{ originX: 0.5, originY: 1 }} className="relative">
          <button
            type="button"
            onClick={handlePat}
            aria-label="Pat Sir Fluffington"
            className="relative block aspect-[4/5] h-[min(30dvh,16rem)] rounded-[2rem]"
          >
            <CrochetedBunny mood={mood} blush={blushing} className="h-full w-full" />
          </button>
        </motion.div>
        <AnimatePresence>{pats === content.bunny.secretTapsNeeded && <HeartSparkle key="sparkle" />}</AnimatePresence>
      </div>

      <div className="flex min-h-[6.5rem] flex-col items-center gap-3">
        <motion.p
          key={pats}
          initial={pats ? { scale: 1.25 } : false}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream/80 px-4 py-1.5 text-[1.05rem] font-medium text-berry-deep"
          aria-live="polite"
        >
          {content.bunny.counter(pats)}
        </motion.p>
        <AnimatePresence>
          {sincereReached && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 }}
            >
              <PillButton onClick={onNext} burstCount={9}>
                {content.bunny.next}
              </PillButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  )
}
