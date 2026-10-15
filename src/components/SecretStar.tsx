import { motion } from 'motion/react'
import { useBurst } from './BurstProvider'
import { StarIcon } from './Shapes'

interface SecretStarProps {
  message: string
  /** Positioning classes, e.g. "right-8 top-24". The star is absolutely placed. */
  className?: string
}

/** A tiny star that, if you find it and tap it, says something nice. */
export function SecretStar({ message, className = '' }: SecretStarProps) {
  const { burst, toast } = useBurst()
  return (
    <button
      type="button"
      aria-label="A tiny star. Tap it."
      onClick={(e) => {
        burst(e, { kind: 'sparkle', count: 8 })
        toast(message)
      }}
      className={`absolute z-20 grid h-11 w-11 place-items-center rounded-full ${className}`}
    >
      <motion.span
        className="twinkle block text-[#f5c26b]"
        whileTap={{ scale: 1.6, rotate: 40 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      >
        <StarIcon width={16} height={16} />
      </motion.span>
    </button>
  )
}
