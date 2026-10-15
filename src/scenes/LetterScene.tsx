import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { content } from '../content'
import { Envelope, type EnvelopePhase } from '../components/Envelope'
import { Letter } from '../components/Letter'
import { PillButton } from '../components/PillButton'
import { SceneShell } from '../components/SceneShell'
import { SecretStar } from '../components/SecretStar'
import { useBurst } from '../components/BurstProvider'
import { sound } from '../services/sound'

interface Props {
  onNext: () => void
}

/** A crocheted doily for the envelope to sit on. */
function Doily() {
  const petals = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    return { x: 150 + Math.cos(a) * 118, y: 60 + Math.sin(a) * 36 }
  })
  return (
    <svg viewBox="0 0 300 130" className="pointer-events-none absolute left-1/2 top-[48%] -z-0 w-[125%] -translate-x-1/2" aria-hidden="true">
      <ellipse cx={150} cy={74} rx={140} ry={44} fill="#b5566f" opacity={0.12} />
      {petals.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.x} cy={p.y} rx={20} ry={11} fill="#fffaf5" stroke="#e8c7cf" strokeWidth={2} />
        </g>
      ))}
      <ellipse cx={150} cy={60} rx={118} ry={36} fill="#fffaf5" stroke="#e8c7cf" strokeWidth={2} />
      <ellipse cx={150} cy={60} rx={118} ry={36} fill="url(#stitchV)" />
      <ellipse cx={150} cy={60} rx={96} ry={28} fill="none" stroke="#f0c4cf" strokeWidth={2.4} strokeDasharray="2 7" strokeLinecap="round" />
    </svg>
  )
}

/** Scene 3: the letter. */
export function LetterScene({ onNext }: Props) {
  const { burst } = useBurst()
  const [phase, setPhase] = useState<EnvelopePhase>('closed')
  const [showLetter, setShowLetter] = useState(false)
  const envRef = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const open = () => {
    if (phase !== 'closed') return
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    sound.playRustle()
    setPhase('breaking')
    burst(envRef.current, { kind: 'sparkle', count: 6 })
    later(() => {
      setPhase('flap')
      burst(envRef.current, { kind: 'hearts', count: 10 })
    }, 450)
    later(() => setPhase('rise'), 1100)
    later(() => {
      setPhase('open')
      setShowLetter(true)
    }, 2150)
    later(() => burst(letterRef.current ?? envRef.current, { kind: 'hearts', count: 14 }), 2700)
    later(() => letterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 2500)
  }

  return (
    <SceneShell tone="cream" seed={5}>
      <SecretStar message={content.secretStars.letter} className="right-7 top-24" />

      <header className="space-y-2">
        <h1 className="title text-[1.9rem] sm:text-4xl">{content.letter.heading}</h1>
        <p className="lead mx-auto max-w-[19rem] text-base">{content.letter.subtitle}</p>
      </header>

      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div
            key="envelope"
            ref={envRef}
            exit={{ opacity: 0, y: 30, scale: 0.88, transition: { duration: 0.4 } }}
            className="relative mt-[7.5rem] mb-14 w-full"
          >
            <Doily />
            <div className="relative z-10">
              <Envelope phase={phase} onOpen={open} />
            </div>
            <motion.p
              className="font-hand relative z-10 mt-5 text-[1.5rem] text-berry"
              initial={false}
              animate={{ opacity: phase === 'closed' ? 1 : 0 }}
            >
              {content.letter.openHint}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="letter" ref={letterRef} className="w-full pt-3" style={{ perspective: 1000 }}>
            <Letter />
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 140, damping: 16 }}
            >
              <PillButton onClick={onNext} burstCount={8}>
                {content.letter.next}
              </PillButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  )
}
