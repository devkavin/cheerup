import type { ElementType } from 'react'

/**
 * Hidden SVG defs shared by every illustration.
 * `#stitchV` is a tiled crochet "V" pattern used to give flat shapes a yarn texture.
 */
export function CrochetDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="stitchV" width="8" height="10" patternUnits="userSpaceOnUse">
          {/* soft highlight under each stitch */}
          <g stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0.6 2.6 L4 6 L7.4 2.6" />
            <path d="M-3.4 7.6 L0 11 L3.4 7.6" />
            <path d="M4.6 7.6 L8 11 L11.4 7.6" />
          </g>
          <g stroke="#8a5a4c" strokeOpacity="0.17" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0.6 1.6 L4 5 L7.4 1.6" />
            <path d="M-3.4 6.6 L0 10 L3.4 6.6" />
            <path d="M4.6 6.6 L8 10 L11.4 6.6" />
          </g>
        </pattern>
      </defs>
    </svg>
  )
}

interface StitchedProps {
  el?: 'ellipse' | 'path' | 'circle' | 'rect'
  fill: string
  stroke?: string
  strokeWidth?: number
  [geometry: string]: unknown
}

/** A shape drawn as "yarn": solid fill, stitch texture, outline and a dashed seam highlight. */
export function Stitched({ el = 'path', fill, stroke = '#c99a86', strokeWidth = 2.2, ...geometry }: StitchedProps) {
  const Tag = el as ElementType
  return (
    <>
      <Tag {...geometry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Tag {...geometry} fill="url(#stitchV)" stroke="none" />
      <Tag
        {...geometry}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="1.3"
        strokeDasharray="2.5 5"
        strokeLinecap="round"
      />
    </>
  )
}
