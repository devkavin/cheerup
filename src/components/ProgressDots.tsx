import { motion } from 'motion/react'
import { content } from '../content'
import { HeartIcon } from './Shapes'

interface ProgressDotsProps {
  current: number
  furthest: number
  onSelect: (index: number) => void
}

/** A tiny thread of five stitches at the top: filled hearts are visited, tap one to revisit. */
export function ProgressDots({ current, furthest, onSelect }: ProgressDotsProps) {
  return (
    <nav
      aria-label="Story progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[max(0.4rem,env(safe-area-inset-top))]"
    >
      <ol className="pointer-events-auto relative flex h-8 sm:h-9 items-center rounded-b-xl border-x-2 border-b-2 border-white/90 bg-gradient-to-b from-cream/95 to-[#fdf6fa]/95 px-2 sm:px-3 shadow-[0_6px_14px_-4px_rgba(181,86,111,0.28),inset_0_-2px_0_rgba(217,155,170,0.25)] backdrop-blur-xs">
        <span
          aria-hidden="true"
          className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t border-dashed border-rose/60"
        />
        {content.sceneNames.map((name, i) => {
          const reachable = i <= furthest
          const isCurrent = i === current
          return (
            <li key={name} className="relative">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(i)}
                aria-label={`${reachable ? 'Go to' : 'Locked:'} scene ${i + 1}, ${name}`}
                aria-current={isCurrent ? 'step' : undefined}
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full disabled:cursor-default"
              >
                <motion.span
                  animate={{ scale: isCurrent ? 1.2 : 1 }}
                  whileTap={reachable ? { scale: 0.85 } : undefined}
                  transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                  className="grid place-items-center"
                >
                  {reachable ? (
                    <HeartIcon
                      width={isCurrent ? 20 : 16}
                      height={isCurrent ? 20 : 16}
                      className={isCurrent ? 'text-berry drop-shadow' : 'text-rose'}
                    />
                  ) : (
                    <span className="block h-2 w-2 rounded-full border-2 border-rose/70 bg-cream" />
                  )}
                </motion.span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
