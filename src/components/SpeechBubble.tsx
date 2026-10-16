import type { ReactNode } from 'react'
import { motion } from 'motion/react'

interface SpeechBubbleProps {
  children: ReactNode
  /** The sincere variant: larger, warmer, with heartfelt styling. */
  special?: boolean
}

/** A pop-in speech bubble whose tail points down at the speaker. */
export function SpeechBubble({ children, special = false }: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 4, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 380, damping: special ? 20 : 15 }}
      style={{ transformOrigin: '50% 100%' }}
      className={`relative mx-auto ${special ? 'w-full' : 'max-w-[18.5rem]'}`}
    >
      <div
        className={`soft-shadow relative rounded-[1.8rem] border-2 text-center transition-all ${
          special
            ? 'border-[#e57f9b] bg-gradient-to-b from-[#fffefa] via-[#fff5f7] to-[#fceef2] px-5 py-4 text-[1.05rem] leading-[1.48] font-medium text-cocoa shadow-[0_16px_32px_-12px_rgba(217,105,135,0.35),inset_0_2px_0_rgba(255,255,255,0.95)]'
            : 'border-white/95 bg-cream px-5 py-3 text-[1.1rem] leading-snug font-medium text-cocoa shadow-[0_10px_22px_-10px_rgba(181,86,111,0.25),inset_0_2px_0_rgba(255,255,255,0.9)]'
        }`}
      >
        {special && (
          <span className="mb-1 block font-hand text-sm font-semibold tracking-wide text-berry">
            ✧ a sincere note from Sir Fluffington ✧
          </span>
        )}
        <div>{children}</div>
      </div>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 -bottom-[9px] z-0 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 ${
          special ? 'border-[#e57f9b] bg-[#fceef2]' : 'border-white/95 bg-cream'
        }`}
      />
    </motion.div>
  )
}
