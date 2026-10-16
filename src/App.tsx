import { useCallback, useEffect, useState } from 'react'
import { motion, MotionConfig } from 'motion/react'
import { BurstProvider } from './components/BurstProvider'
import { CrochetDefs } from './components/CrochetDefs'
import { ProgressDots } from './components/ProgressDots'
import { SceneTransition } from './components/SceneTransition'
import { SoundToggle } from './components/SoundToggle'
import { ComplaintShredder } from './components/ComplaintShredder'
import { ComfortDrawer } from './components/ComfortDrawer'
import { WelcomeScene } from './scenes/WelcomeScene'
import { BunnyScene } from './scenes/BunnyScene'
import { LetterScene } from './scenes/LetterScene'
import { SerotoninScene } from './scenes/SerotoninScene'
import { CrochetScene } from './scenes/CrochetScene'

const SCENE_COUNT = 5
const STORAGE_KEY = 'little-something:progress:v1'

interface Progress {
  current: number
  furthest: number
}

/** Only scene progress is remembered. Interaction state (like the bunny's pat count) always starts fresh. */
function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Progress>
      const furthest = Math.min(Math.max(Number(parsed.furthest) || 0, 0), SCENE_COUNT - 1)
      const current = Math.min(Math.max(Number(parsed.current) || 0, 0), furthest)
      return { current, furthest }
    }
  } catch {
    /* private mode etc. Just start from the beginning. */
  }
  return { current: 0, furthest: 0 }
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [shredderOpen, setShredderOpen] = useState(false)
  const [comfortOpen, setComfortOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* ignore */
    }
  }, [progress])

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= SCENE_COUNT || index > progress.furthest + 1 || index === progress.current) return
      setDirection(index > progress.current ? 1 : -1)
      setProgress({ current: index, furthest: Math.max(progress.furthest, index) })
    },
    [progress],
  )

  const next = useCallback(() => goTo(progress.current + 1), [goTo, progress.current])

  const scene = [
    <WelcomeScene key="s0" onNext={next} />,
    <BunnyScene key="s1" onNext={next} />,
    <LetterScene key="s2" onNext={next} />,
    <SerotoninScene key="s3" onNext={next} />,
    <CrochetScene key="s4" />,
  ][progress.current]

  return (
    <MotionConfig reducedMotion="user">
      <BurstProvider>
        <CrochetDefs />
        <div className="fixed inset-0 overflow-hidden bg-blush">
          <SceneTransition sceneKey={progress.current} direction={direction}>
            {scene}
          </SceneTransition>
          {/* Handcrafted storybook frame with embroidered floret corners */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-[8px] sm:inset-[12px] z-40 rounded-[1.8rem] border-2 border-dashed border-rose/40"
          >
            <span className="absolute -top-1.5 -left-1.5 text-xs text-rose/70 font-mono select-none">✦</span>
            <span className="absolute -top-1.5 -right-1.5 text-xs text-rose/70 font-mono select-none">✦</span>
            <span className="absolute -bottom-1.5 -left-1.5 text-xs text-rose/70 font-mono select-none">✦</span>
            <span className="absolute -bottom-1.5 -right-1.5 text-xs text-rose/70 font-mono select-none">✦</span>
            {/* Soft book spine shadow on the left */}
            <span className="absolute left-0 inset-y-0 w-3 rounded-l-[1.8rem] bg-gradient-to-r from-cocoa/5 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Top Header Handcrafted Bookmark Ribbon Tabs */}
        <div className="pointer-events-none fixed left-3 sm:left-5 top-0 z-50 flex items-start gap-1.5 pt-[max(0.4rem,env(safe-area-inset-top))]">
          <motion.button
            type="button"
            onClick={() => setShredderOpen(true)}
            whileHover={{ y: 2, scale: 1.04 }}
            whileTap={{ y: 4, scale: 0.96 }}
            aria-label="Open Complaint Shredder"
            title="School Drama Shredder"
            className="pointer-events-auto relative flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-b-xl border-x-2 border-b-2 border-white/90 bg-gradient-to-b from-cream/95 to-[#faebee]/95 px-2.5 sm:px-3 text-xs font-semibold text-berry-deep shadow-[0_6px_14px_-4px_rgba(181,86,111,0.28),inset_0_-2px_0_rgba(217,155,170,0.25)] backdrop-blur-xs transition-colors hover:bg-cream"
          >
            <span aria-hidden="true" className="absolute -top-1 left-2 right-2 border-t border-dashed border-rose/60" />
            <span className="text-sm">✂️</span>
            <span className="hidden sm:inline font-medium">Shred Drama</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setComfortOpen(true)}
            whileHover={{ y: 2, scale: 1.04 }}
            whileTap={{ y: 4, scale: 0.96 }}
            aria-label="Open Bad Day Emergency Protocol"
            title="Bad Day Comfort Checklist"
            className="pointer-events-auto relative flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-b-xl border-x-2 border-b-2 border-white/90 bg-gradient-to-b from-cream/95 to-[#fdf3e9]/95 px-2.5 sm:px-3 text-xs font-semibold text-cocoa shadow-[0_6px_14px_-4px_rgba(181,86,111,0.28),inset_0_-2px_0_rgba(217,155,170,0.25)] backdrop-blur-xs transition-colors hover:bg-cream"
          >
            <span aria-hidden="true" className="absolute -top-1 left-2 right-2 border-t border-dashed border-rose/60" />
            <span className="text-sm">☕</span>
            <span className="hidden sm:inline font-medium">Comfort Kit</span>
          </motion.button>
        </div>

        {/* Story Progress */}
        <ProgressDots current={progress.current} furthest={progress.furthest} onSelect={goTo} />

        {/* Sound Toggle (Top Right Bookmark Ribbon) */}
        <div className="pointer-events-none fixed right-3 sm:right-5 top-0 z-50 flex items-start pt-[max(0.4rem,env(safe-area-inset-top))]">
          <SoundToggle />
        </div>

        {/* Interactive Modals */}
        <ComplaintShredder isOpen={shredderOpen} onClose={() => setShredderOpen(false)} />
        <ComfortDrawer isOpen={comfortOpen} onClose={() => setComfortOpen(false)} />
      </BurstProvider>
    </MotionConfig>
  )
}
