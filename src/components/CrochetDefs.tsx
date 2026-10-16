import type { ElementType } from 'react'

/**
 * Shared SVG defs for handcrafted crochet, felt, and stationery textures.
 * `#stitchV` - Interlocking crocheted single-crochet V-stitch texture.
 * `#knitRib` - Knitted ribbing for scarves, beanies, and trim.
 * `#linenPaper` - Subtle paper fiber texture.
 */
export function CrochetDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {/* Interlocking crochet V-stitch pattern */}
        <pattern id="stitchV" width="8" height="10" patternUnits="userSpaceOnUse">
          {/* Depth shadow behind stitches */}
          <g stroke="#73493e" strokeOpacity="0.14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0.6 3.2 L4 6.8 L7.4 3.2" />
            <path d="M-3.4 8.2 L0 11.8 L3.4 8.2" />
            <path d="M4.6 8.2 L8 11.8 L11.4 8.2" />
          </g>
          {/* Main stitch loop */}
          <g stroke="#8a5a4c" strokeOpacity="0.22" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0.6 1.8 L4 5.4 L7.4 1.8" />
            <path d="M-3.4 6.8 L0 10.4 L3.4 6.8" />
            <path d="M4.6 6.8 L8 10.4 L11.4 6.8" />
          </g>
          {/* Top yarn highlight */}
          <g stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M0.8 1.0 L4 4.4 L7.2 1.0" />
            <path d="M-3.2 6.0 L0 9.4 L3.2 6.0" />
            <path d="M4.8 6.0 L8 9.4 L11.2 6.0" />
          </g>
        </pattern>

        {/* Chunky knit rib pattern for scarves, beanies, and borders */}
        <pattern id="knitRib" width="6" height="8" patternUnits="userSpaceOnUse">
          <line x1="1" y1="0" x2="1" y2="8" stroke="#000" strokeOpacity="0.08" strokeWidth="1" />
          <line x1="3" y1="0" x2="3" y2="8" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
          <line x1="5" y1="0" x2="5" y2="8" stroke="#000" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>

        {/* Soft amigurumi plush shadow filter */}
        <filter id="plushShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#8f3f57" floodOpacity="0.14" />
        </filter>
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

/** A shape drawn as handcrafted "yarn": solid fill, stitch texture, warm outline and embroidered thread seam. */
export function Stitched({ el = 'path', fill, stroke = '#c99a86', strokeWidth = 2.4, ...geometry }: StitchedProps) {
  const Tag = el as ElementType
  return (
    <>
      <Tag {...geometry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Tag {...geometry} fill="url(#stitchV)" stroke="none" />
      {/* Hand-sewn thread stitch line */}
      <Tag
        {...geometry}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.65"
        strokeWidth="1.3"
        strokeDasharray="2.5 4.5"
        strokeLinecap="round"
      />
    </>
  )
}
