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
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={muted ? 'Enable cozy sounds' : 'Mute sounds'}
      title={muted ? 'Enable cozy music-box sounds' : 'Mute sounds'}
      className="pointer-events-auto flex h-8 w-8 sm:h-auto sm:w-auto items-center justify-center gap-1.5 rounded-full border-2 border-white/80 bg-cream/90 px-0 sm:px-3 sm:py-1.5 text-xs font-semibold text-berry-deep shadow-[0_4px_14px_-4px_rgba(181,86,111,0.35)] backdrop-blur-sm transition-colors hover:bg-cream"
    >
      {muted ? (
        <>
          <VolumeX className="h-4 w-4 opacity-60" />
          <span className="hidden sm:inline">Sound: Off</span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4 text-berry" />
          <span className="hidden sm:inline">Sound: On 🎵</span>
        </>
      )}
    </motion.button>
  )
}
