import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Coffee, Check, X, Sparkles } from 'lucide-react'
import { sound } from '../services/sound'
import { useBurst } from './BurstProvider'

const CHECKLIST_ITEMS = [
  { id: 'hoodie', label: 'Wrap up in an oversized hoodie or cozy blanket' },
  { id: 'drink', label: 'Drink water (or iced coffee, we do not judge)' },
  { id: 'school', label: 'Remember school is temporary, being a menace is forever' },
  { id: 'hair', label: 'Acknowledge that your hair actually looks lovely today' },
  { id: 'kiss', label: 'Accept one (1) official virtual forehead kiss' },
]

interface ComfortDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ComfortDrawer({ isOpen, onClose }: ComfortDrawerProps) {
  const { burst } = useBurst()
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (id: string, e: React.MouseEvent) => {
    const nextState = !checked[id]
    setChecked((prev) => ({ ...prev, [id]: nextState }))
    if (nextState) {
      sound.playPop()
      burst(e, { kind: 'sparkle', count: 6 })
    } else {
      sound.playChime(400, 0.1)
    }
  }

  const completedCount = Object.values(checked).filter(Boolean).length

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cocoa/30 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="soft-shadow relative z-10 w-full max-w-sm rounded-[2rem] border-2 border-white bg-cream p-6 text-center text-cocoa"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close comfort checklist"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-cocoa/60 hover:text-cocoa"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/50 text-berry">
              <Coffee className="h-6 w-6" />
            </div>

            <h2 className="title mt-3 text-2xl text-berry-deep">Bad Day Emergency Protocol</h2>
            <p className="lead mt-1 text-xs">A tiny, non-negotiable checklist for today.</p>

            <div className="mt-4 space-y-2 text-left">
              {CHECKLIST_ITEMS.map((item) => {
                const isDone = !!checked[item.id]
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => toggle(item.id, e)}
                    className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                      isDone
                        ? 'border-berry/40 bg-rose/15 text-cocoa line-through opacity-85'
                        : 'border-rose/25 bg-white/70 hover:bg-white text-cocoa'
                    }`}
                  >
                    <div
                      className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-md border transition-colors ${
                        isDone ? 'border-berry bg-berry text-white' : 'border-rose/50 bg-white'
                      }`}
                    >
                      {isDone && <Check className="h-3 w-3" />}
                    </div>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {completedCount === CHECKLIST_ITEMS.length && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-berry"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#f5c26b]" />
                <span>Protocol 100% complete. You did it!</span>
                <Heart className="h-3.5 w-3.5 text-rose fill-rose" />
              </motion.div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-full bg-berry px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-berry-deep"
            >
              Close & Keep Being Awesome 🩷
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
