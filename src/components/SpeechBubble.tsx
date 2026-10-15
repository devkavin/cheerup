import type { ReactNode } from 'react'
import { motion } from 'motion/react'

interface SpeechBubbleProps {
  children: ReactNode
  /** The sincere variant: larger, warmer, with a little heart. */
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
      className={`relative mx-auto ${special ? 'w-full' : 'max-w-[18rem]'}`}
    >
      <div
        className={`soft-shadow relative rounded-[1.6rem] border-2 text-center ${
          special
            ? 'border-rose bg-gradient-to-b from-[#fffafb] to-[#f7e9fb] px-5 py-4 text-[1.05rem] leading-[1.45] font-medium text-cocoa'
            : 'border-white bg-cream px-5 py-3 text-[1.1rem] leading-snug font-medium text-cocoa'
        }`}
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 -bottom-[9px] z-0 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 ${
          special ? 'border-rose bg-[#f7e9fb]' : 'border-white bg-cream'
        }`}
      />
    </motion.div>
  )
}
