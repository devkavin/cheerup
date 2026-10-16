import { motion } from 'motion/react'
import { Stitched } from './CrochetDefs'
import { HEART_PATH } from './Shapes'

export type BunnyMood = 'idle' | 'surprised' | 'smug' | 'hug' | 'sly' | 'soft' | 'blush' | 'happy'

type EyeKind = 'open' | 'wide' | 'side' | 'happy' | 'soft' | 'wink'
type MouthKind = 'smile' | 'o' | 'smirk' | 'big' | 'grin'

const FACE: Record<BunnyMood, { eyes: EyeKind; mouth: MouthKind }> = {
  idle: { eyes: 'open', mouth: 'smile' },
  surprised: { eyes: 'wide', mouth: 'o' },
  smug: { eyes: 'side', mouth: 'smirk' },
  hug: { eyes: 'happy', mouth: 'big' },
  sly: { eyes: 'wink', mouth: 'grin' },
  soft: { eyes: 'soft', mouth: 'smile' },
  blush: { eyes: 'soft', mouth: 'smile' },
  happy: { eyes: 'happy', mouth: 'big' },
}

const YARN = '#fff3e8'
const YARN_LIGHT = '#fffdf9'
const OUTLINE = '#c99a86'
const INNER_EAR = '#f7bccb'
const INK = '#3d251e'
const MOUTH = '#a5536b'
const CHEEK = '#f29bb1'
const SCARF = '#cdb8ea'
const SCARF_STRIPE = '#f29bb1'

const L = { x: 90, y: 148 }
const R = { x: 150, y: 148 }

/** Amigurumi safety glass eye with felt base and spherical depth */
function OpenEye({ x, y, rx = 8.5, ry = 11, dx = 0 }: { x: number; y: number; rx?: number; ry?: number; dx?: number }) {
  return (
    <g>
      {/* Felt backer ring */}
      <ellipse cx={x} cy={y + 1} rx={rx + 1.8} ry={ry + 1.8} fill="#3a221c" opacity={0.2} />
      {/* Glass safety eye */}
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} />
      {/* Primary glossy shine */}
      <circle cx={x - 2.8 + dx} cy={y - 3.8} r={rx * 0.38} fill="#fff" />
      {/* Secondary soft reflection */}
      <circle cx={x + 3.2 + dx} cy={y + 3.4} r={rx * 0.22} fill="#fff" opacity={0.85} />
      {/* Tiny bottom catchlight */}
      <circle cx={x - 0.5 + dx} cy={y + 3.8} r={rx * 0.12} fill="#fff" opacity={0.7} />
    </g>
  )
}

const HappyEye = ({ x, y }: { x: number; y: number }) => (
  <g>
    <path d={`M${x - 10} ${y + 4} Q${x} ${y - 11} ${x + 10} ${y + 4}`} stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />
    <path d={`M${x - 7} ${y + 2} Q${x} ${y - 8} ${x + 7} ${y + 2}`} stroke="#fff" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.4} />
  </g>
)

const SoftEye = ({ x, y }: { x: number; y: number }) => (
  <g>
    <path d={`M${x - 10} ${y - 3} Q${x} ${y + 10} ${x + 10} ${y - 3}`} stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />
    <path d={`M${x - 7} ${y - 1} Q${x} ${y + 8} ${x + 7} ${y - 1}`} stroke="#fff" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.4} />
  </g>
)

function Eyes({ kind }: { kind: EyeKind }) {
  switch (kind) {
    case 'wide':
      return (
        <>
          <OpenEye {...L} rx={10} ry={13} />
          <OpenEye {...R} rx={10} ry={13} />
        </>
      )
    case 'side':
      return (
        <>
          <OpenEye {...L} dx={3.5} />
          <OpenEye {...R} dx={3.5} />
        </>
      )
    case 'happy':
      return (
        <>
          <HappyEye {...L} />
          <HappyEye {...R} />
        </>
      )
    case 'soft':
      return (
        <>
          <SoftEye {...L} />
          <SoftEye {...R} />
        </>
      )
    case 'wink':
      return (
        <>
          <OpenEye {...L} />
          <HappyEye {...R} />
        </>
      )
    default:
      return (
        <>
          <OpenEye {...L} />
          <OpenEye {...R} />
        </>
      )
  }
}

function Mouth({ kind }: { kind: MouthKind }) {
  const line = { stroke: MOUTH, strokeWidth: 2.6, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'o':
      return <ellipse cx={120} cy={177} rx={4.5} ry={5.5} fill={MOUTH} />
    case 'smirk':
      return <path d="M120 167 V171 M120 171 Q129 181 139 169" {...line} />
    case 'big':
      return (
        <g>
          <path d="M103 171 Q120 194 137 171 Z" fill={MOUTH} stroke={MOUTH} strokeWidth={2.4} strokeLinejoin="round" />
          <ellipse cx={120} cy={184} rx={6.5} ry={3.6} fill="#f48aa5" />
        </g>
      )
    case 'grin':
      return (
        <g>
          <path d="M105 170 Q120 190 135 170 Q120 175 105 170Z" fill={MOUTH} stroke={MOUTH} strokeWidth={2.4} strokeLinejoin="round" />
        </g>
      )
    default:
      return <path d="M120 167 V171 M120 171 Q113 178.5 106 172 M120 171 Q127 178.5 134 172" {...line} />
  }
}

export type BunnyAccessory = 'none' | 'strawberry' | 'frog' | 'glasses' | 'crown'

interface CrochetedBunnyProps {
  mood?: BunnyMood
  /** Deeper blush + little blush lines. */
  blush?: boolean
  /** Turn off idle breathing / ear wiggles. */
  still?: boolean
  accessory?: BunnyAccessory
  className?: string
}

/**
 * Sir Fluffington III. A handcrafted SVG plushie with stitch-textured "yarn" fills,
 * floppy ears, scarf, flower and an expressive face that follows `mood`.
 */
export function CrochetedBunny({ mood = 'idle', blush = false, still = false, accessory = 'none', className }: CrochetedBunnyProps) {
  const face = FACE[mood]
  const canBlink = face.eyes === 'open' || face.eyes === 'wide' || face.eyes === 'side' || face.eyes === 'wink'
  const perk = mood === 'surprised'
  const armSpread = mood === 'hug' ? 52 : mood === 'happy' ? 26 : mood === 'surprised' ? 14 : 0

  const idle = still
    ? undefined
    : { rotate: [-1.4, 1.4, -1.4], scaleY: [1, 1.018, 1] }

  return (
    <motion.svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-label="A crocheted bunny named Sir Fluffington III"
      style={{ originX: 0.5, originY: 1, overflow: 'visible' }}
      animate={idle}
      transition={{
        rotate: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' },
        scaleY: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {/* ground shadow */}
      <ellipse cx={120} cy={294} rx={78} ry={7} fill="#b5566f" opacity={0.16} />

      {/* ears */}
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        animate={perk ? { rotate: -9 } : still ? { rotate: 0 } : { rotate: [0, -8, 6, -3, 0] }}
        transition={perk || still ? { type: 'spring', stiffness: 300, damping: 12 } : { duration: 1.1, repeat: Infinity, repeatDelay: 5.5, ease: 'easeInOut' }}
      >
        <g transform="rotate(-11 82 112)">
          <Stitched el="ellipse" cx={82} cy={56} rx={22} ry={58} fill={YARN} stroke={OUTLINE} />
          <Stitched el="ellipse" cx={82} cy={64} rx={11.5} ry={42} fill={INNER_EAR} stroke="#e79bb0" strokeWidth={1.6} />
          {/* Inner felt stitch marks */}
          <path d="M78 40 v32 M86 42 v28" stroke="#fff" strokeWidth={1.3} strokeDasharray="3 5" opacity={0.65} fill="none" />
        </g>
      </motion.g>
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        animate={perk ? { rotate: 9 } : still ? { rotate: 0 } : { rotate: [0, 7, -6, 3, 0] }}
        transition={perk || still ? { type: 'spring', stiffness: 300, damping: 12 } : { duration: 1.1, repeat: Infinity, repeatDelay: 8, delay: 2.5, ease: 'easeInOut' }}
      >
        <g transform="rotate(32 152 112)">
          <Stitched el="ellipse" cx={152} cy={58} rx={22} ry={56} fill={YARN} stroke={OUTLINE} />
          <Stitched el="ellipse" cx={152} cy={66} rx={11.5} ry={40} fill={INNER_EAR} stroke="#e79bb0" strokeWidth={1.6} />
          {/* Inner felt stitch marks */}
          <path d="M148 42 v30 M156 44 v26" stroke="#fff" strokeWidth={1.3} strokeDasharray="3 5" opacity={0.65} fill="none" />
        </g>
      </motion.g>

      {/* body */}
      <Stitched el="ellipse" cx={120} cy={232} rx={62} ry={56} fill={YARN} stroke={OUTLINE} />
      <Stitched el="ellipse" cx={120} cy={242} rx={36} ry={31} fill={YARN_LIGHT} stroke="#e4cdbd" strokeWidth={1.6} />

      {/* Belly patch embroidered cross-stitches */}
      <g stroke="#d49aa9" strokeWidth={1.4} strokeLinecap="round" opacity={0.65}>
        <path d="M96 226 l4 4 M100 226 l-4 4" />
        <path d="M140 226 l4 4 M144 226 l-4 4" />
        <path d="M92 250 l4 4 M96 250 l-4 4" />
        <path d="M144 250 l4 4 M148 250 l-4 4" />
      </g>

      {/* Stitched Belly Heart */}
      <g transform="translate(105 228) scale(1.25)">
        <path d={HEART_PATH} fill="#f29bb1" stroke="#d4708c" strokeWidth={1.2} strokeLinejoin="round" />
        <path d={HEART_PATH} fill="url(#stitchV)" />
        <path d={HEART_PATH} fill="none" stroke="#fff" strokeWidth={1.2} strokeDasharray="2 4" opacity={0.7} />
      </g>

      {/* feet */}
      <Stitched el="ellipse" cx={84} cy={285} rx={25} ry={13} fill={YARN} stroke={OUTLINE} />
      <Stitched el="ellipse" cx={156} cy={285} rx={25} ry={13} fill={YARN} stroke={OUTLINE} />
      {/* Toe yarn separation stitches */}
      <g stroke="#d9b6a4" strokeWidth={2.2} strokeLinecap="round">
        <path d="M78 280 v8 M90 280 v8 M150 280 v8 M162 280 v8" />
      </g>

      {/* scarf (behind the head so the chin tucks in) */}
      <path d="M62 198 Q120 222 178 198 L184 215 Q120 244 56 215 Z" fill={SCARF} stroke="#a98fcf" strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M62 198 Q120 222 178 198 L184 215 Q120 244 56 215 Z" fill="url(#stitchV)" />
      <g transform="rotate(-7 156 226)">
        <rect x={144} y={222} width={26} height={44} rx={8} fill={SCARF} stroke="#a98fcf" strokeWidth={2.4} />
        <rect x={144} y={222} width={26} height={44} rx={8} fill="url(#stitchV)" />
        <path d="M144 238 H170 M144 248 H170" stroke={SCARF_STRIPE} strokeWidth={3.8} strokeLinecap="round" />
        {/* Scarf fluffy fringe tassels */}
        <g stroke="#9f85c7" strokeWidth={2.4} strokeLinecap="round">
          <path d="M148 266 v7 M153 266 v9 M158 266 v8 M163 266 v9 M167 266 v7" />
        </g>
      </g>

      {/* arms */}
      <motion.g style={{ originX: 0.5, originY: 0.12 }} animate={{ rotate: armSpread }} transition={{ type: 'spring', stiffness: 260, damping: 13 }}>
        <g transform="rotate(14 58 232)">
          <Stitched el="ellipse" cx={56} cy={238} rx={14} ry={31} fill={YARN} stroke={OUTLINE} />
        </g>
      </motion.g>
      <motion.g style={{ originX: 0.5, originY: 0.12 }} animate={{ rotate: -armSpread }} transition={{ type: 'spring', stiffness: 260, damping: 13 }}>
        <g transform="rotate(-14 182 232)">
          <Stitched el="ellipse" cx={184} cy={238} rx={14} ry={31} fill={YARN} stroke={OUTLINE} />
        </g>
      </motion.g>

      {/* head */}
      <Stitched el="ellipse" cx={120} cy={145} rx={78} ry={64} fill={YARN} stroke={OUTLINE} />

      {/* little crocheted flower (default) */}
      {accessory !== 'crown' && (
        <g transform="translate(66 98)">
          {[0, 72, 144, 216, 288].map((a) => (
            <g key={a} transform={`rotate(${a}) translate(0 -8)`}>
              <circle r={6.6} fill="#ffd2b8" stroke="#e8a98a" strokeWidth={1.4} />
              <circle r={6.6} fill="url(#stitchV)" />
            </g>
          ))}
          <circle r={5} fill="#fff3c4" stroke="#e8c870" strokeWidth={1.4} />
        </g>
      )}

      {/* cheeks */}
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scale: blush ? 1.3 : 1, opacity: blush ? 1 : 0.82 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      >
        <ellipse cx={72} cy={166} rx={15} ry={10} fill={CHEEK} />
        <ellipse cx={168} cy={166} rx={15} ry={10} fill={CHEEK} />
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: blush ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        stroke="#e0607f"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M63 169 l3 -6 M70 169 l3 -6 M77 169 l3 -6" />
        <path d="M160 169 l3 -6 M167 169 l3 -6 M174 169 l3 -6" />
      </motion.g>

      {/* Subtle stitched amigurumi whiskers */}
      <g stroke="#c49a8c" strokeWidth={1.4} strokeLinecap="round" opacity={0.35}>
        <path d="M52 163 L34 160 M52 168 L33 170" />
        <path d="M188 163 L206 160 M188 168 L207 170" />
      </g>

      {/* eyes */}
      <motion.g
        animate={canBlink ? { scaleY: [1, 0.08, 1] } : { scaleY: 1 }}
        transition={canBlink ? { duration: 0.22, repeat: Infinity, repeatDelay: 3.4 } : { duration: 0 }}
      >
        <Eyes kind={face.eyes} />
      </motion.g>

      {/* Embroidered felt nose + mouth */}
      <g>
        {/* Soft pink felt triangle */}
        <polygon points="114,159 126,159 120,165" fill="#e58ca0" stroke="#c46a82" strokeWidth={1.2} strokeLinejoin="round" />
        {/* Nose highlight */}
        <line x1="116" y1="160" x2="124" y2="160" stroke="#fff" strokeWidth={1} strokeLinecap="round" opacity={0.8} />
        {/* Vertical embroidery stem down to mouth */}
        <line x1="120" y1="165" x2="120" y2="171" stroke={MOUTH} strokeWidth={2.4} strokeLinecap="round" />
        <Mouth kind={face.mouth} />
      </g>

      {/* --- WARDROBE ACCESSORIES --- */}

      {/* 1. Strawberry Beret */}
      {accessory === 'strawberry' && (
        <g transform="translate(136 78) rotate(16)">
          <path d="M-22 8 Q0 -28 24 6 Q16 26 -2 24 Q-22 22 -22 8Z" fill="#f25f7c" stroke="#c43b57" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-22 8 Q0 -28 24 6 Q16 26 -2 24 Q-22 22 -22 8Z" fill="url(#stitchV)" />
          {/* stem */}
          <path d="M2 -18 Q6 -26 12 -25" stroke="#7eb77f" strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d="M-5 -16 L2 -12 L9 -17 L3 -8 L-5 -16Z" fill="#9bd29c" stroke="#68a069" strokeWidth={1.5} />
          {/* seeds */}
          <g fill="#fff" opacity={0.85}>
            <circle cx="-10" cy="4" r="1.3" />
            <circle cx="2" cy="0" r="1.3" />
            <circle cx="12" cy="8" r="1.3" />
            <circle cx="-2" cy="14" r="1.3" />
            <circle cx="8" cy="16" r="1.3" />
          </g>
        </g>
      )}

      {/* 2. Frog Hood */}
      {accessory === 'frog' && (
        <g transform="translate(120 90)">
          {/* Beanie band */}
          <path d="M-54 14 Q0 -16 54 14 Q40 -26 0 -26 Q-40 -26 -54 14Z" fill="#8bc38c" stroke="#5d965e" strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-54 14 Q0 -16 54 14 Q40 -26 0 -26 Q-40 -26 -54 14Z" fill="url(#stitchV)" />
          {/* Ribbed brim */}
          <path d="M-52 14 Q0 -14 52 14" stroke="#5d965e" strokeWidth={2} strokeDasharray="3 5" fill="none" />
          {/* Frog eyes */}
          <g transform="translate(-28 -20)">
            <circle cx="0" cy="0" r="13" fill="#8bc38c" stroke="#5d965e" strokeWidth={2.2} />
            <circle cx="0" cy="0" r="13" fill="url(#stitchV)" />
            <circle cx="0" cy="0" r="7.5" fill="#fff" />
            <circle cx="0" cy="0" r="4.2" fill="#364937" />
            <circle cx="-1.8" cy="-1.8" r="1.5" fill="#fff" />
          </g>
          <g transform="translate(28 -20)">
            <circle cx="0" cy="0" r="13" fill="#8bc38c" stroke="#5d965e" strokeWidth={2.2} />
            <circle cx="0" cy="0" r="13" fill="url(#stitchV)" />
            <circle cx="0" cy="0" r="7.5" fill="#fff" />
            <circle cx="0" cy="0" r="4.2" fill="#364937" />
            <circle cx="-1.8" cy="-1.8" r="1.5" fill="#fff" />
          </g>
        </g>
      )}

      {/* 3. Reading Glasses */}
      {accessory === 'glasses' && (
        <g transform="translate(120 148)" stroke="#d4943a" strokeWidth={3} fill="none" strokeLinecap="round">
          {/* left rim */}
          <circle cx="-30" cy="0" r="17" fill="rgba(255,255,255,0.28)" />
          {/* right rim */}
          <circle cx="30" cy="0" r="17" fill="rgba(255,255,255,0.28)" />
          {/* bridge */}
          <path d="M-13 -3 Q0 -9 13 -3" />
          {/* arms */}
          <path d="M-47 -2 L-66 -10 M47 -2 L66 -10" />
          {/* shine */}
          <path d="M-36 -8 L-28 -4 M24 -8 L32 -4" stroke="#fff" strokeWidth={1.8} opacity={0.8} />
        </g>
      )}

      {/* 4. Flower Crown */}
      {accessory === 'crown' && (
        <g transform="translate(120 102)">
          {/* vine */}
          <path d="M-52 6 Q0 -12 52 6" fill="none" stroke="#7eb77f" strokeWidth={3} strokeLinecap="round" />
          {/* flowers */}
          {[-42, -21, 0, 21, 42].map((x, idx) => {
            const colors = ['#f8b7c8', '#ffd2b8', '#fff3c4', '#cdb8ea', '#f8b7c8']
            const c = colors[idx]
            return (
              <g key={x} transform={`translate(${x} ${Math.abs(x) * 0.14 - 4})`}>
                <circle r={6.4} fill={c} stroke="#b5566f" strokeWidth={1.2} />
                <circle r={6.4} fill="url(#stitchV)" />
                <circle r={2.5} fill="#fff" />
              </g>
            )
          })}
        </g>
      )}
    </motion.svg>
  )
}
