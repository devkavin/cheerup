import { motion } from 'motion/react'
import { content } from '../content'
import { HEART_PATH } from './Shapes'

/** The finished letter: handwritten text on ruled paper, taped to the page. */
export function Letter() {
  const paragraphs = content.letter.paragraphs
  return (
    <motion.article
      aria-label="A letter for you"
      initial={{ opacity: 0, scaleY: 0.22, rotateX: -55 }}
      animate={{ opacity: 1, scaleY: 1, rotateX: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16 }}
      style={{ transformOrigin: '50% 0%' }}
      className="relative mx-auto w-full max-w-[24rem] rounded-xl border border-[#ecd9d0] bg-[#fffdf8] px-6 pb-8 pt-9 text-left shadow-[0_22px_40px_-18px_rgba(143,63,87,0.45),0_2px_0_rgba(255,255,255,0.9)_inset]"
    >
      {/* washi tape */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 -rotate-2 rounded-sm bg-[#f8c8d6]/90 shadow-sm"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.5) 0 5px, transparent 5px 10px)' }}
      />
      {/* margin line */}
      <span aria-hidden="true" className="absolute bottom-0 left-4 top-0 w-px bg-[#f2b8c6]/70" />

      {/* fold creases that fade away as the letter finishes unfolding */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.9, duration: 1.6 }}
        style={{
          background:
            'linear-gradient(transparent calc(33.3% - 1px), rgba(143,63,87,.22) calc(33.3% - 1px) 33.3%, rgba(255,255,255,.8) 33.3% calc(33.3% + 2px), transparent calc(33.3% + 2px)), linear-gradient(transparent calc(66.6% - 1px), rgba(143,63,87,.22) calc(66.6% - 1px) 66.6%, rgba(255,255,255,.8) 66.6% calc(66.6% + 2px), transparent calc(66.6% + 2px))',
        }}
      />

      <div className="relative space-y-4 pl-1 font-hand text-[1.4rem] sm:text-[1.5rem] leading-relaxed text-cocoa">
        {paragraphs.map((p, i) => {
          const last = i === paragraphs.length - 1
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className={`${last ? 'text-center text-berry text-2xl pt-2' : ''} ${i === 0 ? 'text-[1.75rem] font-bold text-berry-deep pb-1' : 'font-medium'}`}
            >
              {p}
            </motion.p>
          )
        })}
      </div>

      <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute bottom-3 right-6 h-5 w-5 opacity-40 text-rose">
        <path d={HEART_PATH} fill="currentColor" />
      </svg>
    </motion.article>
  )
}
