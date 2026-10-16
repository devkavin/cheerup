import { useEffect } from 'react'
import { motion, useAnimationControls } from 'motion/react'
import { Stitched } from './CrochetDefs'
import { HEART_PATH } from './Shapes'

const BUNNY = '#fff3e8'
const BUNNY_OUT = '#c99a86'
const BEAR = '#ecc4a4'
const BEAR_OUT = '#b98a6c'
const INK = '#4a3028'
const CHEEK = '#f29bb1'
const MOUTH = '#a5536b'

function Face({ blush = 1 }: { blush?: number }) {
  return (
    <g>
      <ellipse cx={-29} cy={9} rx={10} ry={6.5} fill={CHEEK} opacity={0.88 * blush} />
      <ellipse cx={29} cy={9} rx={10} ry={6.5} fill={CHEEK} opacity={0.88 * blush} />
      <g stroke="#e0607f" strokeWidth={1.4} strokeLinecap="round" opacity={0.6 * blush}>
        <path d="M-33 11 l2 -4 M-28 11 l2 -4" />
        <path d="M26 11 l2 -4 M31 11 l2 -4" />
      </g>
      <path d="M-25 1 Q-17 -11 -9 1 M9 1 Q17 -11 25 1" stroke={INK} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={7} rx={4.6} ry={3.4} fill="#e58ca0" />
      <ellipse cx={-1} cy={6} rx={1.4} ry={1} fill="#fff" opacity={0.65} />
      <path d="M0 10 v3.5 M0 13.5 q-5 4.5 -10 1 M0 13.5 q5 4.5 10 1" stroke={MOUTH} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

interface HuggingPairProps {
  /** Increment to trigger a squeeze. */
  squeezeKey: number
}

/** Two little crocheted friends, hugging. Squeezes whenever `squeezeKey` changes. */
export function HuggingPair({ squeezeKey }: HuggingPairProps) {
  const left = useAnimationControls()
  const right = useAnimationControls()
  const heads = useAnimationControls()

  useEffect(() => {
    if (!squeezeKey) return
    left.start({ x: [0, 16, 9, 16, 0], scaleX: [1, 0.92, 0.96, 0.91, 1], rotate: [0, 3, 1, 3, 0], transition: { duration: 1, ease: 'easeInOut' } })
    right.start({ x: [0, -16, -9, -16, 0], scaleX: [1, 0.92, 0.96, 0.91, 1], rotate: [0, -3, -1, -3, 0], transition: { duration: 1, ease: 'easeInOut' } })
    heads.start({ y: [0, 3, 0, 3, 0], transition: { duration: 1 } })
  }, [squeezeKey, left, right, heads])

  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" style={{ overflow: 'visible' }} role="img" aria-label="Two crocheted friends hugging">
      <ellipse cx={160} cy={212} rx={110} ry={7} fill="#b5566f" opacity={0.16} />

      <motion.g animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} style={{ originX: 0.5, originY: 1 }}>
        {/* bear (right) body & feet, behind */}
        <motion.g animate={right} style={{ originX: 0.5, originY: 1 }}>
          <Stitched el="ellipse" cx={205} cy={168} rx={44} ry={42} fill={BEAR} stroke={BEAR_OUT} />
          <Stitched el="ellipse" cx={205} cy={176} rx={24} ry={24} fill="#fff0e0" stroke="#dcb99d" strokeWidth={1.5} />
          <Stitched el="ellipse" cx={184} cy={208} rx={20} ry={10} fill={BEAR} stroke={BEAR_OUT} />
          <Stitched el="ellipse" cx={228} cy={208} rx={20} ry={10} fill={BEAR} stroke={BEAR_OUT} />
          {/* scarf */}
          <path d="M165 138 Q205 156 245 138 L249 150 Q205 170 161 150 Z" fill="#f29bb1" stroke="#d4708c" strokeWidth={2} strokeLinejoin="round" />
          <path d="M165 138 Q205 156 245 138 L249 150 Q205 170 161 150 Z" fill="url(#stitchV)" />
        </motion.g>

        {/* bunny (left) body & feet */}
        <motion.g animate={left} style={{ originX: 0.5, originY: 1 }}>
          <Stitched el="ellipse" cx={115} cy={168} rx={44} ry={42} fill={BUNNY} stroke={BUNNY_OUT} />
          <Stitched el="ellipse" cx={115} cy={176} rx={24} ry={24} fill="#fffdf9" stroke="#e4cdbd" strokeWidth={1.5} />
          <g transform="translate(106 168) scale(0.75)">
            <path d={HEART_PATH} fill="#f29bb1" stroke="#d4708c" strokeWidth={1.4} strokeLinejoin="round" />
            <path d={HEART_PATH} fill="url(#stitchV)" />
          </g>
          <Stitched el="ellipse" cx={92} cy={208} rx={20} ry={10} fill={BUNNY} stroke={BUNNY_OUT} />
          <Stitched el="ellipse" cx={136} cy={208} rx={20} ry={10} fill={BUNNY} stroke={BUNNY_OUT} />
          <path d="M75 138 Q115 156 155 138 L159 150 Q115 170 71 150 Z" fill="#cdb8ea" stroke="#a98fcf" strokeWidth={2} strokeLinejoin="round" />
          <path d="M75 138 Q115 156 155 138 L159 150 Q115 170 71 150 Z" fill="url(#stitchV)" />
        </motion.g>

        {/* the arms: each wraps around the other's back */}
        <motion.g animate={right} style={{ originX: 0.5, originY: 1 }}>
          <g transform="rotate(-7 160 160)">
            <Stitched el="ellipse" cx={148} cy={160} rx={40} ry={11.5} fill={BEAR} stroke={BEAR_OUT} />
          </g>
          <g transform="rotate(14 250 165)">
            <Stitched el="ellipse" cx={252} cy={168} rx={11} ry={26} fill={BEAR} stroke={BEAR_OUT} />
          </g>
        </motion.g>
        <motion.g animate={left} style={{ originX: 0.5, originY: 1 }}>
          <g transform="rotate(7 160 176)">
            <Stitched el="ellipse" cx={172} cy={178} rx={40} ry={11.5} fill={BUNNY} stroke={BUNNY_OUT} />
          </g>
          <g transform="rotate(-14 70 165)">
            <Stitched el="ellipse" cx={68} cy={168} rx={11} ry={26} fill={BUNNY} stroke={BUNNY_OUT} />
          </g>
        </motion.g>

        {/* heads */}
        <motion.g animate={heads}>
          <motion.g animate={right} style={{ originX: 0.5, originY: 1 }}>
            <g transform="translate(200 98) rotate(-8)">
              <Stitched el="circle" cx={-30} cy={-32} r={14} fill={BEAR} stroke={BEAR_OUT} />
              <circle cx={-30} cy={-31} r={7} fill="#f4b7a6" />
              <Stitched el="circle" cx={30} cy={-32} r={14} fill={BEAR} stroke={BEAR_OUT} />
              <circle cx={30} cy={-31} r={7} fill="#f4b7a6" />
              <Stitched el="ellipse" cx={0} cy={0} rx={46} ry={38} fill={BEAR} stroke={BEAR_OUT} />
              <Stitched el="ellipse" cx={0} cy={11} rx={17} ry={12} fill="#fff0e0" stroke="#dcb99d" strokeWidth={1.4} />
              <Face />
            </g>
          </motion.g>
          <motion.g animate={left} style={{ originX: 0.5, originY: 1 }}>
            <g transform="translate(120 98) rotate(8)">
              <g transform="rotate(-8 -22 -30)">
                <Stitched el="ellipse" cx={-22} cy={-52} rx={13} ry={36} fill={BUNNY} stroke={BUNNY_OUT} />
                <Stitched el="ellipse" cx={-22} cy={-48} rx={6.5} ry={25} fill="#f7bccb" stroke="#e79bb0" strokeWidth={1.2} />
              </g>
              <g transform="rotate(16 24 -30)">
                <Stitched el="ellipse" cx={24} cy={-52} rx={13} ry={34} fill={BUNNY} stroke={BUNNY_OUT} />
                <Stitched el="ellipse" cx={24} cy={-48} rx={6.5} ry={24} fill="#f7bccb" stroke="#e79bb0" strokeWidth={1.2} />
              </g>
              <Stitched el="ellipse" cx={0} cy={0} rx={46} ry={38} fill={BUNNY} stroke={BUNNY_OUT} />
              <Face />
            </g>
          </motion.g>
        </motion.g>

        {/* a tiny heart floating between them */}
        <motion.g
          animate={{ y: [0, -6, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <g transform="translate(149 8) scale(0.9)">
            <path d={HEART_PATH} fill="#f29bb1" stroke="#d4708c" strokeWidth={1.4} strokeLinejoin="round" />
            <path d={HEART_PATH} fill="url(#stitchV)" />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  )
}
