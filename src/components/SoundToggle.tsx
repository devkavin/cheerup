import { useState } from 'react'
import { motion } from 'motion/react'
import { Volume2, VolumeX } from 'lucide-react'
import { sound } from '../services/sound'

export function SoundToggle() {
  const [muted, setMuted] = useState(() => sound.isMuted())

  const toggle = () => {
    const next = sound.toggleMute()
    setMuted(next)
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ y: 2, scale: 1.04 }}
      whileTap={{ y: 4, scale: 0.96 }}
      aria-label={muted ? 'Enable cozy sounds' : 'Mute sounds'}
      title={muted ? 'Enable cozy music-box sounds' : 'Mute sounds'}
      className="pointer-events-auto relative flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-b-xl border-x-2 border-b-2 border-white/90 bg-gradient-to-b from-cream/95 to-[#f7eef3]/95 px-2.5 sm:px-3 text-xs font-semibold text-berry-deep shadow-[0_6px_14px_-4px_rgba(181,86,111,0.28),inset_0_-2px_0_rgba(217,155,170,0.25)] backdrop-blur-xs transition-colors hover:bg-cream"
    >
      <span aria-hidden="true" className="absolute -top-1 left-2 right-2 border-t border-dashed border-rose/60" />
      {muted ? (
        <>
          <VolumeX className="h-3.5 w-3.5 opacity-60" />
          <span className="hidden sm:inline font-medium text-cocoa-soft">Sound: Off</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5 text-berry animate-pulse" />
          <span className="hidden sm:inline font-medium text-berry-deep">Sound: On 🎵</span>
        </>
      )}
    </motion.button>
  )
}
