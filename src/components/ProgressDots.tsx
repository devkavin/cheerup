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
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      <ol className="pointer-events-auto relative flex items-center rounded-full border-2 border-white/80 bg-cream/85 px-1.5 sm:px-2 shadow-[0_8px_18px_-8px_rgba(181,86,111,0.4)] backdrop-blur-sm">
        <span
          aria-hidden="true"
          className="absolute left-5 right-5 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-rose/60"
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
