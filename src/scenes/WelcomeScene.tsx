import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { content } from '../content'
import { CrochetedBunny, type BunnyMood } from '../components/CrochetedBunny'
import { PillButton } from '../components/PillButton'
import { SceneShell } from '../components/SceneShell'
import { SecretStar } from '../components/SecretStar'
import { useBurst } from '../components/BurstProvider'
import { YarnBallArt, YarnBallFrame } from '../components/YarnBall'
import { sound } from '../services/sound'

interface Props {
  onNext: () => void
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, type: 'spring' as const, stiffness: 120, damping: 16 },
})

/** Scene 1: the welcome. */
export function WelcomeScene({ onNext }: Props) {
  const { burst } = useBurst()
  const [mood, setMood] = useState<BunnyMood>('idle')
  const [leaving, setLeaving] = useState(false)
  const moodTimer = useRef<number | undefined>(undefined)
  const [ballKey, setBallKey] = useState(0)

  return (
    <SceneShell tone="pink" seed={3}>
      <SecretStar message={content.secretStars.welcome} className="right-6 top-24" />

      <motion.div {...rise(0.05)} className="relative">
        <motion.button
          type="button"
          aria-label="Say hi to the bunny"
          className="relative block h-[min(30dvh,15.5rem)] aspect-[4/5] rounded-[2rem]"
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            sound.playPurr()
            burst(e, { kind: 'hearts', count: 5 })
            setMood('happy')
            window.clearTimeout(moodTimer.current)
            moodTimer.current = window.setTimeout(() => setMood('idle'), 1600)
          }}
        >
          <CrochetedBunny mood={mood} className="h-full w-full" />
        </motion.button>

        {/* a stray ball of yarn that you can bounce */}
        <motion.button
          type="button"
          aria-label="Bounce the yarn ball"
          key={ballKey}
          className="absolute -left-12 bottom-0 grid h-14 w-14 place-items-center"
          animate={ballKey ? { y: [0, -34, 0, -10, 0], rotate: [0, -50, 20, -8, 0] } : undefined}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onClick={(e) => {
            sound.playPop()
            burst(e, { kind: 'sparkle', count: 5 })
            setBallKey((k) => k + 1)
          }}
        >
          <YarnBallFrame size={46}>
            <YarnBallArt r={20} />
          </YarnBallFrame>
        </motion.button>
        <svg viewBox="0 0 120 40" className="pointer-events-none absolute -left-7 bottom-1 w-28" fill="none" aria-hidden="true">
          <path d="M4 22 C24 40 40 4 62 24 S100 34 118 20" stroke="#e57f9b" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 5" />
        </svg>
      </motion.div>

      <motion.h1 {...rise(0.2)} className="title mt-2 text-[2.1rem] sm:text-4xl">
        {content.welcome.heading}
      </motion.h1>

      <motion.p {...rise(0.32)} className="lead max-w-[22rem] text-[1.05rem]">
        {content.welcome.sub}
      </motion.p>

      <motion.div {...rise(0.46)} className="mt-3">
        <PillButton
          disabled={leaving}
          burstCount={12}
          onClick={() => {
            if (leaving) return
            setLeaving(true)
            window.setTimeout(onNext, 520)
          }}
        >
          {content.welcome.button}
        </PillButton>
      </motion.div>
    </SceneShell>
  )
}
