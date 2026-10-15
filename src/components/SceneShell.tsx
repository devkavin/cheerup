import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { FloatingHearts } from './FloatingHearts'

export type SceneTone = 'pink' | 'lav' | 'cream' | 'blushlav' | 'dream'

interface SceneShellProps {
  tone: SceneTone
  seed?: number
  /** Fades in a warm peach glow over the whole scene (used for the sincere bunny moment). */
  warm?: boolean
  children: ReactNode
}

/** Squiggle of yarn tucked into a corner. Purely decorative. */
function YarnSquiggle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 90" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 70c18-34 34 20 52-12s30-40 46-10 24 18 32-6"
        stroke="#d99baa"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 7"
        opacity=".7"
      />
      <path d="M6 70c18-34 34 20 52-12s30-40 46-10 24 18 32-6" stroke="#f29bb1" strokeWidth="2" strokeLinecap="round" opacity=".35" />
      <circle cx="132" cy="52" r="6" fill="#f8b7c8" stroke="#d99baa" strokeWidth="1.6" />
    </svg>
  )
}

/**
 * Wraps every scene: pastel paper background, drifting decor, and a centred, mobile-first column.
 */
export function SceneShell({ tone, seed = 1, warm = false, children }: SceneShellProps) {
  return (
    <div className="relative min-h-full w-full">
      <div className={`absolute inset-0 scene-${tone}`} />
      <div className="paper-dots absolute inset-0 opacity-70" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(90% 60% at 50% 55%, rgba(255,214,190,.75), rgba(255,229,212,0) 70%)' }}
        initial={false}
        animate={{ opacity: warm ? 1 : 0 }}
        transition={{ duration: 1.6 }}
      />
      <FloatingHearts seed={seed} />
      <YarnSquiggle className="pointer-events-none absolute -left-3 bottom-4 w-32 opacity-80" />
      <YarnSquiggle className="pointer-events-none absolute -right-4 top-20 w-28 rotate-180 opacity-70" />
      <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center gap-4 px-6 pb-12 pt-[4.75rem] text-center">
        {children}
      </main>
    </div>
  )
}
