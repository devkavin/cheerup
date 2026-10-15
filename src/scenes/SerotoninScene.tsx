import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { content } from '../content'
import { PillButton } from '../components/PillButton'
import { SceneShell } from '../components/SceneShell'
import { SecretStar } from '../components/SecretStar'
import { VendingMachine, type MachineStatus } from '../components/VendingMachine'
import { useBurst } from '../components/BurstProvider'
import { HeartIcon, SparkleIcon } from '../components/Shapes'
import { sound } from '../services/sound'
import type { MouseEvent } from 'react'

interface Props {
  onNext: () => void
}

interface CardData {
  id: number
  text: string
  tint: number
  malfunction: boolean
}

const TINTS = [
  { bg: '#fff6ee', edge: '#f2cdb8', tape: '#f8c8d6' },
  { bg: '#f6f0fd', edge: '#d6c6ee', tape: '#cdb8ea' },
  { bg: '#fff0f4', edge: '#f2bccb', tape: '#ffd9b8' },
  { bg: '#fffbf0', edge: '#efdcae', tape: '#f8c8d6' },
]

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

function shuffled<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** A little paper card that slides out of the heart-shaped slot. */
function MessageCard({ card, number }: { card: CardData; number: number }) {
  const tint = TINTS[card.tint % TINTS.length]
  return (
    <motion.div
      initial={{ y: '-125%', scale: 0.5, rotate: -3, opacity: 1 }}
      animate={{ y: 0, scale: 1, rotate: card.malfunction ? 1.5 : -1, opacity: 1 }}
      exit={{ y: 30, opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 130, damping: 13, mass: 0.9 }}
      style={{ transformOrigin: '50% 0%', background: tint.bg, borderColor: tint.edge }}
      className="soft-shadow pointer-events-auto relative mx-auto min-h-[8.5rem] w-full rounded-2xl border-2 border-dashed px-5 pb-4 pt-6 text-center"
    >
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 rotate-2 rounded-sm opacity-90"
        style={{ background: tint.tape, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.55) 0 4px, transparent 4px 8px)' }}
      />
      <p className="font-hand text-lg leading-none text-berry">
        {card.malfunction ? 'oops card' : `card no. ${String(number).padStart(3, '0')}`}
      </p>
      <p className="mt-2 text-[1.08rem] font-medium leading-snug text-cocoa text-pretty">{card.text}</p>
      <HeartIcon width={14} height={14} className="mx-auto mt-2.5 text-rose" />
    </motion.div>
  )
}

/** Scene 4: the Emergency Serotonin Dispenser. */
export function SerotoninScene({ onNext }: Props) {
  const { burst } = useBurst()
  const shake = useAnimationControls()
  const [count, setCount] = useState(0)
  const [card, setCard] = useState<CardData | null>(null)
  const [status, setStatus] = useState<MachineStatus>('idle')
  const bag = useRef<string[]>([])
  const busy = useRef(false)
  const lastWasMalfunction = useRef(false)
  const countRef = useRef(0)
  const trayRef = useRef<HTMLDivElement>(null)
  const machineRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  /** Cycles through every message before repeating any. */
  const nextMessage = () => {
    if (!bag.current.length) bag.current = shuffled(content.serotonin.messages)
    return bag.current.pop() as string
  }

  const dispense = (e: MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return
    busy.current = true
    const n = countRef.current + 1
    countRef.current = n
    const malfunction = n > 1 && !lastWasMalfunction.current && Math.random() < 0.13
    lastWasMalfunction.current = malfunction

    sound.playVending()
    burst(e, { kind: 'sparkle', count: 5 })
    setStatus(malfunction ? 'error' : 'busy')
    shake.start(
      malfunction
        ? { x: [0, -9, 9, -8, 8, -5, 5, 0], rotate: [0, -2, 2, -2, 2, -1, 1, 0], y: [0, -4, 0, -4, 0], transition: { duration: 1.1 } }
        : { x: [0, -4, 4, -3, 3, 0], rotate: [0, -0.8, 0.8, -0.5, 0.5, 0], transition: { duration: 0.55 } },
    )

    later(() => {
      setCard({ id: n, text: malfunction ? pick(content.serotonin.malfunctions) : nextMessage(), tint: Math.floor(Math.random() * TINTS.length), malfunction })
      setCount(n)
      setStatus(malfunction ? 'error' : 'ok')
      if (malfunction) {
        burst(machineRef.current, { kind: 'rain', count: 34 })
        burst(machineRef.current, { kind: 'confetti', count: 14 })
      } else if (Math.random() < 0.34) {
        burst(trayRef.current, { kind: Math.random() < 0.5 ? 'confetti' : 'hearts', count: 12 })
      }
      later(() => trayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 500)
    }, malfunction ? 800 : 520)

    later(
      () => {
        busy.current = false
        setStatus('idle')
      },
      malfunction ? 2300 : 1500,
    )
  }

  return (
    <SceneShell tone="blushlav" seed={13}>
      <SecretStar message={content.secretStars.serotonin} className="left-5 top-24" />

      <header className="space-y-1.5">
        <h1 className="title text-[1.7rem] sm:text-4xl">{content.serotonin.heading}</h1>
        <p className="lead mx-auto max-w-[20rem] text-[0.98rem]">{content.serotonin.subtitle}</p>
      </header>

      {/* machine, with the card tray tucked underneath it */}
      <div className="relative mb-[11rem] mt-1 h-[var(--mh)] [--mh:clamp(14rem,34dvh,21rem)]" style={{ aspectRatio: '280 / 400' }}>
        <motion.div ref={machineRef} animate={shake} className="h-full w-full" style={{ originX: 0.5, originY: 1 }}>
          <VendingMachine status={status} />
        </motion.div>

        <div
          ref={trayRef}
          className="pointer-events-none absolute left-1/2 top-[84.5%] z-20 w-[min(90vw,21rem)] -translate-x-1/2 overflow-hidden px-1"
          style={{ height: 'calc(var(--mh) * 0.155 + 11.5rem)' }}
        >
          <div className="absolute inset-x-1" style={{ top: 'calc(var(--mh) * 0.155 + 0.7rem)' }} aria-live="polite">
            <AnimatePresence mode="wait">{card && <MessageCard key={card.id} card={card} number={card.id} />}</AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <PillButton onClick={dispense} burstKind={null} className="min-w-[15rem]">
          {content.serotonin.button}
        </PillButton>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-cream/80 px-4 py-1.5 text-[1rem] font-medium text-berry-deep" aria-live="polite">
          <SparkleIcon width={13} height={13} className="text-[#f5c26b]" />
          {content.serotonin.counter(count)}
        </p>
      </div>

      <div className="min-h-[4.5rem]">
        <AnimatePresence>
          {count >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.6 }}
            >
              <PillButton variant="soft" onClick={onNext} burstCount={8}>
                {content.serotonin.next}
              </PillButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  )
}
