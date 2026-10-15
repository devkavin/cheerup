import { HEART_PATH, SPARKLE_PATH } from './Shapes'

export type MachineStatus = 'idle' | 'busy' | 'ok' | 'error'

const DISPLAY_TEXT: Record<MachineStatus, string> = {
  idle: 'READY',
  busy: '...',
  ok: 'YUM!',
  error: 'ERR0R',
}

function Heart({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x - 12 * s} ${y - 21 * s}) scale(${s})`}>
      <path d={HEART_PATH} fill={fill} stroke="#c4607c" strokeWidth={1.2 / s} strokeLinejoin="round" />
      <path d={HEART_PATH} fill="url(#stitchV)" />
    </g>
  )
}

function Ball({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y - r} r={r} fill={fill} stroke="#c4607c" strokeWidth={1.4} />
      <path d={`M${x - r * 0.9} ${y - r * 1.2} Q${x} ${y - r * 0.3} ${x + r * 0.9} ${y - r * 1.3} M${x - r * 0.8} ${y - r * 0.6} Q${x} ${y + r * 0.1} ${x + r * 0.8} ${y - r * 0.7}`} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={1.3} strokeLinecap="round" />
    </g>
  )
}

function Berry({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 10} ${y - 18} Q${x} ${y + 4} ${x + 10} ${y - 18} Q${x} ${y - 24} ${x - 10} ${y - 18}Z`} fill="#f2788f" stroke="#c4607c" strokeWidth={1.3} strokeLinejoin="round" />
      <g fill="#fff" opacity={0.7}>
        <circle cx={x - 4} cy={y - 14} r={1} />
        <circle cx={x + 3} cy={y - 12} r={1} />
        <circle cx={x} cy={y - 7} r={1} />
      </g>
      <path d={`M${x - 6} ${y - 20} L${x} ${y - 25} L${x + 6} ${y - 20}`} fill="#9fd4a0" stroke="#6faa75" strokeWidth={1.2} strokeLinejoin="round" />
    </g>
  )
}

function Jar({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <rect x={x - 9} y={y - 24} width={18} height={24} rx={6} fill={fill} stroke="#b5a0d8" strokeWidth={1.4} />
      <rect x={x - 10} y={y - 29} width={20} height={7} rx={3} fill="#f8b7c8" stroke="#d4708c" strokeWidth={1.2} />
      <rect x={x - 5} y={y - 17} width={10} height={9} rx={3} fill="#fff" opacity={0.7} />
    </g>
  )
}

function MiniBunny({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="#c99a86" strokeWidth={1.3}>
      <ellipse cx={x - 5} cy={y - 30} rx={4} ry={9} fill="#fff3e8" />
      <ellipse cx={x + 5} cy={y - 30} rx={4} ry={9} fill="#fff3e8" />
      <ellipse cx={x} cy={y - 10} rx={12} ry={11} fill="#fff3e8" />
      <g stroke="none">
        <circle cx={x - 4.5} cy={y - 11} r={1.4} fill="#4a3028" />
        <circle cx={x + 4.5} cy={y - 11} r={1.4} fill="#4a3028" />
        <ellipse cx={x - 8} cy={y - 7} rx={2.6} ry={1.8} fill="#f29bb1" />
        <ellipse cx={x + 8} cy={y - 7} rx={2.6} ry={1.8} fill="#f29bb1" />
      </g>
    </g>
  )
}

/**
 * The Emergency Serotonin Dispenser: pastel body, striped awning, shelves of tiny handmade things,
 * a little LED display, blinking lights, candy buttons and a heart-shaped dispensing slot.
 */
export function VendingMachine({ status }: { status: MachineStatus }) {
  const fast = status === 'busy' || status === 'error'
  return (
    <svg viewBox="0 0 280 400" className="h-full w-full" style={{ overflow: 'visible' }} role="img" aria-label="A cute pastel vending machine">
      <defs>
        <clipPath id="vm-glass">
          <rect x={40} y={122} width={132} height={168} rx={14} />
        </clipPath>
      </defs>
      <ellipse cx={140} cy={392} rx={116} ry={8} fill="#b5566f" opacity={0.18} />

      {/* body */}
      <rect x={16} y={22} width={248} height={362} rx={36} fill="#f6b8c8" stroke="#d4708c" strokeWidth={3.5} />
      <rect x={16} y={22} width={248} height={362} rx={36} fill="url(#stitchV)" opacity={0.7} />
      <rect x={26} y={32} width={228} height={342} rx={28} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="3 7" strokeLinecap="round" />

      {/* sign */}
      <rect x={52} y={40} width={176} height={44} rx={18} fill="#fffaf5" stroke="#d4708c" strokeWidth={2.6} />
      <text x={140} y={69} textAnchor="middle" fontSize={21} fontWeight={600} fill="#a34862" letterSpacing="0.4">
        serotonin
      </text>
      <Heart x={74} y={62} s={0.55} fill="#f29bb1" />
      <Heart x={206} y={62} s={0.55} fill="#f29bb1" />

      {/* awning */}
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${36 + i * 26} 92 H${62 + i * 26} V104 A13 13 0 0 1 ${36 + i * 26} 104 Z`}
          fill={i % 2 ? '#fffaf5' : '#e57f9b'}
          stroke="#d4708c"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      ))}

      {/* glass window with shelves */}
      <rect x={40} y={122} width={132} height={168} rx={14} fill="#f1e9fb" stroke="#a98fcf" strokeWidth={3} />
      <g clipPath="url(#vm-glass)">
        <rect x={40} y={122} width={132} height={168} fill="#f5effc" />
        <g stroke="#cbb6ea" strokeWidth={5} strokeLinecap="round">
          <path d="M42 178 H170 M42 234 H170" />
        </g>
        {/* row 1 */}
        <Ball x={62} y={174} r={11} fill="#f29bb1" />
        <Heart x={92} y={172} s={0.95} fill="#f8b7c8" />
        <Ball x={122} y={174} r={11} fill="#cdb8ea" />
        <Berry x={152} y={174} />
        {/* row 2 */}
        <Jar x={58} y={230} fill="#ffe5d4" />
        <MiniBunny x={92} y={230} />
        <Jar x={126} y={230} fill="#e8dff5" />
        <Ball x={152} y={230} r={10} fill="#ffc9b0" />
        {/* row 3 */}
        <Berry x={58} y={286} />
        <Ball x={88} y={286} r={12} fill="#f8b7c8" />
        <Heart x={122} y={284} s={1.05} fill="#f29bb1" />
        <MiniBunny x={152} y={286} />
        {/* glass shine */}
        <path d="M52 122 L82 122 L48 290 L40 290 Z" fill="#fff" opacity={0.4} />
        <path d="M92 122 L102 122 L68 290 L58 290 Z" fill="#fff" opacity={0.25} />
      </g>

      {/* control panel */}
      <rect x={184} y={122} width={64} height={168} rx={14} fill="#fbd3de" stroke="#d4708c" strokeWidth={2.6} />
      <rect x={191} y={130} width={50} height={30} rx={8} fill="#5b3f3a" stroke="#8f3f57" strokeWidth={2} />
      <text
        x={216}
        y={150}
        textAnchor="middle"
        fontSize={status === 'busy' ? 16 : 13}
        fontWeight={600}
        fill={status === 'error' ? '#ff8aa6' : '#ffe3ea'}
        letterSpacing="0.6"
        className={fast ? 'blink-fast' : 'blink-light'}
      >
        {DISPLAY_TEXT[status]}
      </text>
      {/* lights */}
      <g>
        {[
          { x: 199, c: '#f2788f', d: '0s' },
          { x: 216, c: '#cdb8ea', d: '0.4s' },
          { x: 233, c: '#ffd27a', d: '0.8s' },
        ].map((l) => (
          <circle key={l.x} cx={l.x} cy={175} r={5.5} fill={l.c} stroke="#fff" strokeWidth={1.6} className={fast ? 'blink-fast' : 'blink-light'} style={{ ['--delay' as string]: l.d }} />
        ))}
      </g>
      {/* candy buttons */}
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => {
          const colors = ['#e57f9b', '#cdb8ea', '#ffc9b0', '#fffaf5', '#f8b7c8', '#b8e0c8']
          const c = colors[row * 2 + col]
          return (
            <g key={`${row}-${col}`}>
              <circle cx={204 + col * 24} cy={202 + row * 24} r={9.5} fill="#c4607c" opacity={0.35} transform="translate(0 2)" />
              <circle cx={204 + col * 24} cy={202 + row * 24} r={9} fill={c} stroke="#fff" strokeWidth={1.6} />
              <ellipse cx={201 + col * 24} cy={199 + row * 24} rx={3} ry={1.8} fill="#fff" opacity={0.7} />
            </g>
          )
        }),
      )}
      {/* coin slot */}
      <rect x={200} y={270} width={32} height={8} rx={4} fill="#8f3f57" />
      <rect x={206} y={272} width={20} height={2.5} rx={1.25} fill="#4a2432" />

      {/* heart-shaped dispensing bay */}
      <rect x={40} y={306} width={208} height={62} rx={22} fill="#d98aa0" stroke="#b5566f" strokeWidth={2.6} />
      <g transform="translate(112 312) scale(2.45)">
        <path d={HEART_PATH} fill="#6e2f44" stroke="#8f3f57" strokeWidth={0.9} strokeLinejoin="round" />
        <path d="M12 18.6C7.2 14.6 4.4 11.6 4.4 8.6 4.4 6.8 5.7 5.5 7.3 5.5" fill="none" stroke="#a34862" strokeWidth={0.8} strokeLinecap="round" />
      </g>
      <g transform="translate(62 322)">
        <path d={SPARKLE_PATH} fill="#fffaf5" transform="scale(0.8)" opacity={0.85} className="twinkle" />
      </g>
      <g transform="translate(206 322)">
        <path d={SPARKLE_PATH} fill="#fffaf5" transform="scale(0.8)" opacity={0.85} className="twinkle" style={{ ['--delay' as string]: '1.2s' }} />
      </g>

      {/* feet */}
      <ellipse cx={58} cy={386} rx={26} ry={9} fill="#d4708c" />
      <ellipse cx={222} cy={386} rx={26} ry={9} fill="#d4708c" />
    </svg>
  )
}
