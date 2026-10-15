import type { SVGProps } from 'react'

export const HEART_PATH =
  'M12 21.2C5.2 15.6 2 11.9 2 7.9 2 4.9 4.3 2.7 7.1 2.7c1.9 0 3.7 1 4.9 2.9 1.2-1.9 3-2.9 4.9-2.9C19.7 2.7 22 4.9 22 7.9c0 4-3.2 7.7-10 13.3z'

export const SPARKLE_PATH =
  'M12 1.5c.7 6 4.5 9.8 10.5 10.5-6 .7-9.8 4.5-10.5 10.5C11.3 16.5 7.5 12.7 1.5 12 7.5 11.3 11.3 7.5 12 1.5z'

export const STAR_PATH = 'M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.6l-5.9 3.1 1.2-6.6L2.5 9.5l6.6-.9z'

export function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d={HEART_PATH} fill="currentColor" />
    </svg>
  )
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d={SPARKLE_PATH} fill="currentColor" />
    </svg>
  )
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d={STAR_PATH} fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
