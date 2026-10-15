import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { BurstProvider } from './components/BurstProvider'
import { CrochetDefs } from './components/CrochetDefs'
import { ProgressDots } from './components/ProgressDots'
import { SceneTransition } from './components/SceneTransition'
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
          {/* embroidered border, like a stitched card edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-[9px] z-40 rounded-[1.7rem] border-2 border-dashed border-rose/45"
          />
        </div>
        <ProgressDots current={progress.current} furthest={progress.furthest} onSelect={goTo} />
      </BurstProvider>
    </MotionConfig>
  )
}
