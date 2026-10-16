import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Flame, Sparkles, X, Check } from 'lucide-react'
import { PillButton } from './PillButton'
import { useBurst } from './BurstProvider'
import { sound } from '../services/sound'

const PRESET_GRUDGES = [
  'Exhausting teachers & homework',
  'Annoying people having the audacity',
  'Waking up before 11:00 AM',
  'Just the entire concept of today',
]

interface ComplaintShredderProps {
  isOpen: boolean
  onClose: () => void
}

export function ComplaintShredder({ isOpen, onClose }: ComplaintShredderProps) {
  const { burst } = useBurst()
  const [selected, setSelected] = useState<string>(PRESET_GRUDGES[0])
  const [customText, setCustomText] = useState('')
  const [isShredding, setIsShredding] = useState(false)
  const [shredded, setShredded] = useState(false)

  const activeGrudge = customText.trim() ? customText : selected

  const handleShred = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsShredding(true)
    sound.playShred()
    burst(e, { kind: 'confetti', count: 18 })

    window.setTimeout(() => {
      setIsShredding(false)
      setShredded(true)
      burst(e, { kind: 'hearts', count: 14 })
    }, 1250)
  }

  const reset = () => {
    setShredded(false)
    setCustomText('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cocoa/30 backdrop-blur-xs"
          />

          {/* Handcrafted Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="soft-shadow relative z-10 w-full max-w-sm rounded-[2.2rem] border-2 border-white bg-[#fffdfa] p-6 text-center text-cocoa"
          >
            {/* Washi tape at top */}
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 h-5 w-24 -translate-x-1/2 -rotate-1 rounded-xs bg-[#f8c8d6]/95 shadow-xs border-y border-white/60"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.5) 0 4px, transparent 4px 8px)' }}
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close shredder"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-cocoa/60 hover:text-cocoa transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose/20 text-berry">
              <Flame className="h-6 w-6" />
            </div>

            <h2 className="title mt-3 text-2xl text-berry-deep">Complaint Shredder</h2>
            <p className="lead mt-1 text-xs">Sir Fluffington will officially void and shred your grievances.</p>

            {!shredded ? (
              <div className="mt-4 space-y-3">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-cocoa-soft uppercase tracking-wider">Select the violation:</label>
                  <div className="space-y-1.5">
                    {PRESET_GRUDGES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setSelected(g)
                          setCustomText('')
                          sound.playNote(587.33, 0.25, 0.14)
                        }}
                        className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${
                          selected === g && !customText ? 'border-berry bg-rose/20 text-berry-deep shadow-xs' : 'border-rose/30 bg-white/70 hover:bg-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-left">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Or type a custom grudge..."
                    className="w-full rounded-xl border border-rose/30 bg-white/90 px-3 py-2 text-xs text-cocoa placeholder:text-cocoa/40 focus:border-berry focus:outline-none"
                  />
                </div>

                {/* Shredder animation view */}
                <div className="relative mt-2 flex h-14 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-rose/40 bg-white/60">
                  <AnimatePresence>
                    {isShredding ? (
                      <motion.div
                        key="active-shred"
                        initial={{ y: 0 }}
                        animate={{ y: 48 }}
                        transition={{ duration: 1.1, ease: 'linear' }}
                        className="flex flex-col items-center"
                      >
                        <div className="rounded bg-rose px-3 py-1 text-xs font-bold text-white shadow-xs">
                          {activeGrudge}
                        </div>
                        <div className="mt-1 flex gap-1">
                          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-6 w-1 rounded-full bg-berry opacity-75" />
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-berry">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Ready to shred: &ldquo;{activeGrudge}&rdquo;</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <PillButton onClick={handleShred} disabled={isShredding} className="w-full mt-2">
                  {isShredding ? 'Shredding into oblivion...' : 'Obliterate Grudge ✂️'}
                </PillButton>
              </div>
            ) : (
              /* Hand-Stamped Voided Receipt */
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 space-y-3"
              >
                <div className="soft-shadow relative overflow-hidden rounded-2xl border-2 border-dashed border-berry bg-[#fffaf8] p-4 text-center">
                  <span className="font-hand inline-block -rotate-6 rounded-md border-2 border-dashed border-berry bg-rose/10 px-3 py-0.5 text-lg font-bold text-berry">
                    VOIDED & SHREDDED
                  </span>
                  <p className="mt-3 text-xs font-medium text-cocoa">
                    The grievance regarding <strong className="text-berry-deep">&ldquo;{activeGrudge}&rdquo;</strong> has been shredded into microscopic confetti.
                  </p>
                  <p className="mt-2 text-[11px] text-cocoa-soft italic">
                    By order of Sir Fluffington III, school has been placed on timeout. You are legally excused from stress.
                  </p>
                  <div className="mt-3 flex justify-center text-xs font-semibold text-berry">
                    <Check className="mr-1 h-3.5 w-3.5 text-green-600" /> Case Closed
                  </div>
                </div>

                <div className="flex gap-2">
                  <PillButton variant="soft" onClick={reset} className="flex-1 text-xs py-2">
                    Shred another ✂️
                  </PillButton>
                  <PillButton onClick={onClose} className="flex-1 text-xs py-2">
                    I feel better 🩷
                  </PillButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
