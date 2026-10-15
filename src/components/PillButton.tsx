import { motion, type HTMLMotionProps } from 'motion/react'
import { useBurst, type BurstKind } from './BurstProvider'

interface PillButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'soft'
  /** Particle burst on click. Pass null to disable. */
  burstKind?: BurstKind | null
  burstCount?: number
}

/** The chunky, tactile button used everywhere: springy hover, physical press, tiny hearts. */
export function PillButton({
  variant = 'primary',
  burstKind = 'hearts',
  burstCount = 7,
  onClick,
  className = '',
  children,
  ...rest
}: PillButtonProps) {
  const { burst } = useBurst()
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.04, transition: { type: 'spring', stiffness: 520, damping: 11 } }}
      whileTap={{ y: 5, scale: 0.97, transition: { duration: 0.06 } }}
      onClick={(e) => {
        if (burstKind) burst(e, { kind: burstKind, count: burstCount })
        onClick?.(e)
      }}
      className={`pill ${variant === 'soft' ? 'pill-soft' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
