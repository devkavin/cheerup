import { motion } from 'motion/react'
import { HEART_PATH } from './Shapes'

export type EnvelopePhase = 'closed' | 'breaking' | 'flap' | 'rise' | 'open'

/** A wax seal shaped like a heart. When `broken` it cracks in two and falls away. */
function WaxSeal({ broken }: { broken: boolean }) {
  const heart = (
    <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible" aria-hidden="true">
      <g transform="translate(4 5) scale(1.58)">
        <path d={HEART_PATH} fill="#c4607c" stroke="#8f3f57" strokeWidth="1" strokeLinejoin="round" />
        <path d="M12 17.2C7.4 13.4 5.2 11 5.2 8.4c0-1.8 1.4-3.2 3.1-3.2 1.4 0 2.8.8 3.7 2.2.9-1.4 2.3-2.2 3.7-2.2 1.7 0 3.1 1.4 3.1 3.2 0 2.6-2.2 5-6.8 8.8z" fill="none" stroke="#e58aa3" strokeWidth="0.9" strokeLinejoin="round" />
        <ellipse cx="8" cy="6.3" rx="2.2" ry="1.1" fill="#fff" opacity="0.4" transform="rotate(-30 8 6.3)" />
      </g>
    </svg>
  )
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: 'inset(0 50% 0 0)', originX: 0.5, originY: 0.5 }}
        animate={broken ? { x: -16, y: 48, rotate: -38, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.5, 0, 0.9, 0.6] }}
      >
        {heart}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: 'inset(0 0 0 50%)', originX: 0.5, originY: 0.5 }}
        animate={broken ? { x: 16, y: 56, rotate: 34, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.5, 0, 0.9, 0.6] }}
      >
        {heart}
      </motion.div>
    </div>
  )
}

interface EnvelopeProps {
  phase: EnvelopePhase
  onOpen: () => void
}

const PINK = '#f3bccb'
const PINK_DARK = '#e49bb0'
const SEAM = '#c8738c'

/** A pastel envelope built from SVG layers; the flap flips in 3D, the letter slides out. */
export function Envelope({ phase, onOpen }: EnvelopeProps) {
  const opened = phase === 'flap' || phase === 'rise' || phase === 'open'
  const risen = phase === 'rise' || phase === 'open'
  return (
    <div className="relative mx-auto aspect-[4/3] w-[min(84vw,20rem)] select-none" style={{ perspective: 900 }}>
      {/* back of the envelope (visible inside) */}
      <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect x={3} y={3} width={314} height={234} rx={16} fill={PINK_DARK} stroke={SEAM} strokeWidth={3} />
        <rect x={3} y={3} width={314} height={234} rx={16} fill="url(#stitchV)" opacity={0.5} />
      </svg>

      {/* the letter, tucked inside */}
      <motion.div
        className="absolute inset-x-[7%] bottom-[5%] top-[7%] rounded-md border border-[#ecd9d0] bg-[#fffdf8] shadow-sm"
        style={{ zIndex: 2 }}
        initial={false}
        animate={{ y: risen ? '-58%' : '0%' }}
        transition={{ type: 'spring', stiffness: 70, damping: 15 }}
      >
        <div className="mx-auto mt-[12%] w-[70%] space-y-2.5 opacity-80" aria-hidden="true">
          <div className="h-1.5 rounded-full bg-[#f0d3da]" />
          <div className="h-1.5 w-[85%] rounded-full bg-[#f0d3da]" />
          <div className="h-1.5 w-[92%] rounded-full bg-[#f0d3da]" />
          <div className="h-1.5 w-[60%] rounded-full bg-[#f0d3da]" />
        </div>
        <svg viewBox="0 0 24 24" className="absolute bottom-[10%] right-[10%] h-5 w-5" aria-hidden="true">
          <path d={HEART_PATH} fill="#f29bb1" />
        </svg>
      </motion.div>

      {/* front pocket */}
      <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full" style={{ zIndex: 3 }} aria-hidden="true">
        <defs>
          <clipPath id="env-clip">
            <rect x={3} y={3} width={314} height={234} rx={16} />
          </clipPath>
        </defs>
        <g clipPath="url(#env-clip)">
          <path d="M0 0 L162 128 L0 240Z" fill={PINK} />
          <path d="M320 0 L158 128 L320 240Z" fill={PINK} />
          <path d="M0 240 L160 118 L320 240Z" fill="#f8cfdb" />
          <path d="M0 0 L162 128 L0 240Z M320 0 L158 128 L320 240Z M0 240 L160 118 L320 240Z" fill="url(#stitchV)" />
        </g>
        <g fill="none" stroke={SEAM} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5 L160 124 L3 235" strokeDasharray="1 0" opacity={0.55} />
          <path d="M317 5 L160 124 L317 235" opacity={0.55} />
          <path d="M5 236 L160 119 L315 236" opacity={0.55} />
        </g>
        <path d="M14 14 L152 118 M306 14 L168 118 M14 226 L152 130 M306 226 L168 130" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.6} strokeDasharray="2 6" strokeLinecap="round" fill="none" />
        <rect x={3} y={3} width={314} height={234} rx={16} fill="none" stroke={SEAM} strokeWidth={3} />
      </svg>

      {/* flap: outer face and, after flipping, the inner face */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[58.4%]"
        style={{ transformOrigin: '50% 0%', transformStyle: 'preserve-3d' }}
        initial={false}
        animate={{ rotateX: opened ? 180 : 0, zIndex: opened ? 1 : 4 }}
        transition={{ rotateX: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }, zIndex: { delay: opened ? 0.28 : 0, duration: 0 } }}
      >
        <svg viewBox="0 0 320 140" className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }} aria-hidden="true">
          <path d="M3 18 Q3 3 18 3 H302 Q317 3 317 18 L168 132 Q160 138 152 132 Z" fill="#f6c4d2" stroke={SEAM} strokeWidth={3} strokeLinejoin="round" />
          <path d="M3 18 Q3 3 18 3 H302 Q317 3 317 18 L168 132 Q160 138 152 132 Z" fill="url(#stitchV)" />
          <path d="M18 14 H302 Q306 14 304 17 L166 121 Q160 125 154 121 L16 17 Q14 14 18 14Z" fill="none" stroke="#fff" strokeOpacity={0.65} strokeWidth={1.6} strokeDasharray="2 6" strokeLinecap="round" />
        </svg>
        <svg
          viewBox="0 0 320 140"
          className="absolute inset-0 h-full w-full"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          aria-hidden="true"
        >
          <path d="M3 18 Q3 3 18 3 H302 Q317 3 317 18 L168 132 Q160 138 152 132 Z" fill="#dd8fa6" stroke={SEAM} strokeWidth={3} strokeLinejoin="round" />
          <path d="M3 18 Q3 3 18 3 H302 Q317 3 317 18 L168 132 Q160 138 152 132 Z" fill="url(#stitchV)" opacity={0.6} />
        </svg>
      </motion.div>

      {/* wax seal */}
      <div className="absolute left-1/2 top-[48%] h-[22%] w-[16.5%] -translate-x-1/2" style={{ zIndex: 5 }}>
        <WaxSeal broken={phase !== 'closed'} />
      </div>

      {/* the tap target */}
      <button
        type="button"
        onClick={onOpen}
        disabled={phase !== 'closed'}
        aria-label="Open the envelope"
        className="absolute inset-0 rounded-2xl disabled:cursor-default"
        style={{ zIndex: 6 }}
      />
    </div>
  )
}
