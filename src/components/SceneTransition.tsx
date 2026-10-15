import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface SceneTransitionProps {
  sceneKey: number
  /** 1 = moving forward, -1 = going back to an earlier page. */
  direction: 1 | -1
  children: ReactNode
}

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 36, rotateY: dir * 10, scale: 0.97 }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  // the old page swings away from the "spine" like a turning page
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, rotateY: dir * -62, scale: 0.97 }),
}

/** Storybook page-turn between scenes. */
export function SceneTransition({ sceneKey, direction, children }: SceneTransitionProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: 1500 }}>
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={sceneKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.4, 0.1, 0.2, 1] }}
          style={{ transformOrigin: direction === 1 ? '0% 50%' : '100% 50%' }}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
