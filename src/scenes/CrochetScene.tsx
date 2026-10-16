import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { content } from '../content'
import { CrochetedHeart, TOTAL_ROWS } from '../components/CrochetedHeart'
import { HuggingPair } from '../components/HuggingPair'
import { PillButton } from '../components/PillButton'
import { SceneShell } from '../components/SceneShell'
import { SecretStar } from '../components/SecretStar'
import { useBurst } from '../components/BurstProvider'
import { HeartIcon, SparkleIcon } from '../components/Shapes'
import { PolaroidKeepsake } from '../components/PolaroidKeepsake'
import { Camera } from 'lucide-react'
import { sound } from '../services/sound'

type Phase = 'stitching' | 'finished' | 'hugging'

/** Scene 5: the crochet heart finale. */
export function CrochetScene() {
  const { burst } = useBurst()
  const reduced = !!useReducedMotion()
  const [rows, setRows] = useState(0)
  const [tapKey, setTapKey] = useState(0)
  const [phase, setPhase] = useState<Phase>('stitching')
  const [reveal, setReveal] = useState(0)
  const [hugs, setHugs] = useState(0)
  const [showPolaroid, setShowPolaroid] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const rowsRef = useRef(0)

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const addStitch = (e: MouseEvent<HTMLElement>) => {
    if (rowsRef.current >= TOTAL_ROWS) return
    const n = rowsRef.current + 1
    rowsRef.current = n
    setRows(n)
    setTapKey((k) => k + 1)
    sound.playPop(n - 1)
    burst(e, { kind: 'sparkle', count: 3 })

    if (n === TOTAL_ROWS) {
      setPhase('finished')
      later(() => {
        sound.playHug()
        burst(stageRef.current, { kind: 'hearts', count: 14 })
      }, 700)
      later(() => burst(stageRef.current, { kind: 'sparkle', count: 10 }), 1300)
      later(() => setPhase('hugging'), 2300)
    }
  }

  // Once the hug appears, reveal the three messages one after another.
  useEffect(() => {
    if (phase !== 'hugging') return
    sound.playHug()
    burst(stageRef.current, { kind: 'hearts', count: 16 })
    burst(stageRef.current, { kind: 'sparkle', count: 10 })
    if (reduced) {
      setReveal(4)
      return
    }
    const ts = [400, 1500, 2800, 3600].map((ms, i) => window.setTimeout(() => setReveal(i + 1), ms))
    return () => ts.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if (reveal === 4) {
      const t = window.setTimeout(() => endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' }), 250)
      return () => window.clearTimeout(t)
    }
  }, [reveal, reduced])

  const hug = (e: MouseEvent<HTMLButtonElement>) => {
    setHugs((h) => h + 1)
    sound.playHug()
    burst(e, { kind: 'hearts', count: 9 })
    burst(stageRef.current, { kind: 'hearts', count: 12 })
    later(() => burst(stageRef.current, { kind: 'sparkle', count: 8 }), 350)
  }

  const stitching = phase !== 'hugging'
  const percent = Math.round((rows / TOTAL_ROWS) * 100)

  return (
    <SceneShell tone="dream" seed={11}>
      <SecretStar message={content.secretStars.crochet} className="left-5 top-24" />

      <header className="space-y-2">
        <h1 className="title text-[2rem] sm:text-4xl">{content.crochet.heading}</h1>
        <div className="mx-auto flex min-h-[3rem] max-w-[20rem] items-start justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={rows < TOTAL_ROWS ? 'a' : 'b'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="lead text-base"
            >
              {rows < TOTAL_ROWS ? content.crochet.subtitle : content.crochet.subtitleDone}
            </motion.p>
          </AnimatePresence>
        </div>
      </header>

      {/* the stage: heart + yarn, which becomes the hugging pair */}
      <div ref={stageRef} className="relative w-full max-w-[21rem]">
        <div className="relative aspect-[320/220] w-full">
          <AnimatePresence mode="wait" initial={false}>
            {stitching ? (
              <motion.div
                key="heart"
                className="absolute inset-0"
                exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.35 } }}
              >
                <CrochetedHeart rows={rows} done={rows >= TOTAL_ROWS} tapKey={tapKey} />
                {rows < TOTAL_ROWS && (
                  <button
                    type="button"
                    onClick={addStitch}
                    aria-label="Add a stitch"
                    className="absolute inset-0 rounded-[2rem] focus-visible:outline-offset-[-4px]"
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="hug"
                className="absolute inset-0"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 13 }}
              >
                <HuggingPair squeezeKey={hugs} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {stitching ? (
        <div className="flex w-full max-w-[20rem] flex-col items-center gap-4">
          <div className="w-full">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Heart progress"
              className="relative h-3.5 w-full overflow-hidden rounded-full border-2 border-white bg-cream/80"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#f8b7c8] to-[#e57f9b]"
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              />
            </div>
            <p className="mt-1.5 text-sm font-medium text-cocoa-soft" aria-live="polite">
              {content.crochet.progress(rows, TOTAL_ROWS)}
            </p>
          </div>
          <PillButton onClick={addStitch} burstKind={null} disabled={rows >= TOTAL_ROWS} className="min-w-[15rem]">
            {content.crochet.tap}
          </PillButton>
        </div>
      ) : (
        <div className="flex w-full max-w-[21rem] flex-col items-center gap-3">
          {/* every block keeps its space, so revealing never shifts the layout */}
          <motion.p
            initial={false}
            animate={{ opacity: reveal >= 1 ? 1 : 0, y: reveal >= 1 ? 0 : 10 }}
            transition={{ duration: 0.8 }}
            className="title text-[1.4rem] text-berry-deep"
          >
            {content.crochet.final}
          </motion.p>
          <motion.p
            initial={false}
            animate={{ opacity: reveal >= 2 ? 1 : 0, y: reveal >= 2 ? 0 : 10 }}
            transition={{ duration: 0.8 }}
            className="font-hand text-[1.55rem] leading-snug text-cocoa"
          >
            {content.crochet.ps}
          </motion.p>
          <motion.p
            initial={false}
            animate={{ opacity: reveal >= 3 ? 1 : 0, y: reveal >= 3 ? 0 : 10 }}
            transition={{ duration: 0.8 }}
            className="lead rounded-3xl bg-cream/70 px-4 py-3 text-[1rem]"
          >
            {content.crochet.note}
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: reveal >= 4 ? 1 : 0, y: reveal >= 4 ? 0 : 10 }}
            transition={{ duration: 0.6 }}
            style={{ pointerEvents: reveal >= 4 ? 'auto' : 'none' }}
            aria-hidden={reveal < 4}
            className="flex flex-col items-center gap-3 pt-1"
          >
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <PillButton variant="soft" burstKind="sparkle" burstCount={6} onClick={hug} tabIndex={reveal >= 4 ? 0 : -1}>
                {content.crochet.hugButton}
              </PillButton>
              <PillButton
                variant="primary"
                burstKind="confetti"
                burstCount={12}
                onClick={() => setShowPolaroid(true)}
                tabIndex={reveal >= 4 ? 0 : -1}
                className="gap-1.5"
              >
                <Camera className="h-4 w-4" />
                <span>Save Keepsake Polaroid 📸</span>
              </PillButton>
            </div>
            <div className="flex h-8 items-center" aria-live="polite">
              <AnimatePresence mode="wait">
                {hugs > 0 && (
                  <motion.p
                    key={hugs}
                    initial={{ opacity: 0, scale: 0.7, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ type: 'spring', stiffness: 380, damping: 14 }}
                    className="inline-flex items-center gap-1.5 text-[1.05rem] font-medium text-berry-deep"
                  >
                    <HeartIcon width={14} height={14} className="text-rose" />
                    {content.crochet.hugMessage}
                    <SparkleIcon width={14} height={14} className="text-[#f5c26b]" />
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <div ref={endRef} className="h-px w-full" />
        </div>
      )}
      <PolaroidKeepsake isOpen={showPolaroid} onClose={() => setShowPolaroid(false)} />
    </SceneShell>
  )
}
