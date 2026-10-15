import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Download, Camera, X, Heart } from 'lucide-react'
import { PillButton } from './PillButton'
import { sound } from '../services/sound'
import { useBurst } from './BurstProvider'

interface PolaroidProps {
  isOpen: boolean
  onClose: () => void
}

export function PolaroidKeepsake({ isOpen, onClose }: PolaroidProps) {
  const { burst } = useBurst()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [downloaded, setDownloaded] = useState(false)

  const drawPolaroid = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 600
    const H = 760
    canvas.width = W
    canvas.height = H

    // 1. Polaroid White Body
    ctx.fillStyle = '#FFFDF9'
    ctx.fillRect(0, 0, W, H)

    // Inner subtle border
    ctx.strokeStyle = '#E8DFF5'
    ctx.lineWidth = 4
    ctx.strokeRect(8, 8, W - 16, H - 16)

    // 2. Photo Area (Square / 4:3)
    const px = 36
    const py = 36
    const pw = W - 72
    const ph = 480

    // Photo background gradient
    const grad = ctx.createLinearGradient(px, py, px, py + ph)
    grad.addColorStop(0, '#FFF0F5')
    grad.addColorStop(0.5, '#F8DCE5')
    grad.addColorStop(1, '#E8DFF5')
    ctx.fillStyle = grad
    ctx.fillRect(px, py, pw, ph)

    // Decorative photo border
    ctx.strokeStyle = '#D99BAA'
    ctx.lineWidth = 2
    ctx.strokeRect(px, py, pw, ph)

    // Hearts floating in photo background
    ctx.fillStyle = 'rgba(217, 155, 170, 0.35)'
    const heartPoints = [
      { x: px + 40, y: py + 50, r: 12 },
      { x: px + pw - 50, y: py + 60, r: 16 },
      { x: px + 80, y: py + ph - 80, r: 14 },
      { x: px + pw - 80, y: py + ph - 60, r: 12 },
    ]
    heartPoints.forEach((h) => {
      ctx.beginPath()
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw simplified, charming hugging plushies inside photo area
    const cx = px + pw / 2
    const cy = py + ph / 2 + 25

    // Ground shadow
    ctx.fillStyle = 'rgba(181, 86, 111, 0.18)'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 120, 150, 16, 0, 0, Math.PI * 2)
    ctx.fill()

    // Left bunny (Cream/White)
    ctx.fillStyle = '#FFF3E8'
    ctx.strokeStyle = '#C99A86'
    ctx.lineWidth = 4

    // Left bunny ears
    ctx.beginPath()
    ctx.ellipse(cx - 75, cy - 100, 20, 60, -0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#F7BCCB'
    ctx.beginPath()
    ctx.ellipse(cx - 75, cy - 90, 10, 42, -0.15, 0, Math.PI * 2)
    ctx.fill()

    // Right bear ears
    ctx.fillStyle = '#ECC4A4'
    ctx.strokeStyle = '#B98A6C'
    ctx.beginPath()
    ctx.arc(cx + 95, cy - 95, 24, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Left bunny head & body
    ctx.fillStyle = '#FFF3E8'
    ctx.strokeStyle = '#C99A86'
    ctx.beginPath()
    ctx.ellipse(cx - 50, cy, 65, 55, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Right bear head & body
    ctx.fillStyle = '#ECC4A4'
    ctx.strokeStyle = '#B98A6C'
    ctx.beginPath()
    ctx.ellipse(cx + 50, cy, 65, 55, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Intertwined hugging arms
    ctx.beginPath()
    ctx.ellipse(cx, cy + 30, 70, 18, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#ECC4A4'
    ctx.fill()
    ctx.stroke()

    // Cheerful smiling sleeping eyes
    ctx.strokeStyle = '#4A3028'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'

    // Bunny face
    ctx.beginPath()
    ctx.arc(cx - 70, cy - 10, 10, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx - 35, cy - 10, 10, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()

    // Bunny blush
    ctx.fillStyle = '#F29BB1'
    ctx.beginPath()
    ctx.arc(cx - 80, cy + 5, 8, 0, Math.PI * 2)
    ctx.arc(cx - 25, cy + 5, 8, 0, Math.PI * 2)
    ctx.fill()

    // Bear face
    ctx.beginPath()
    ctx.arc(cx + 35, cy - 10, 10, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx + 70, cy - 10, 10, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()

    // Bear blush
    ctx.fillStyle = '#F4B7A6'
    ctx.beginPath()
    ctx.arc(cx + 25, cy + 5, 8, 0, Math.PI * 2)
    ctx.arc(cx + 80, cy + 5, 8, 0, Math.PI * 2)
    ctx.fill()

    // Little heart floating between heads
    ctx.fillStyle = '#F29BB1'
    ctx.beginPath()
    ctx.arc(cx - 4, cy - 50, 8, 0, Math.PI * 2)
    ctx.arc(cx + 4, cy - 50, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx - 10, cy - 47)
    ctx.lineTo(cx, cy - 35)
    ctx.lineTo(cx + 10, cy - 47)
    ctx.fill()

    // 3. Bottom Handwritten Text
    ctx.textAlign = 'center'
    ctx.fillStyle = '#5B3F3A'
    ctx.font = 'bold 30px "Caveat", cursive, sans-serif'
    ctx.fillText('Certified Emotional Support Menace', W / 2, 570)

    ctx.font = '22px "Caveat", cursive, sans-serif'
    ctx.fillStyle = '#7A5852'
    ctx.fillText('"You are doing great, even when today was being a bitch."', W / 2, 620)

    ctx.font = 'italic 19px "Fredoka", sans-serif'
    ctx.fillStyle = '#B5566F'
    ctx.fillText('♡ From your favourite nuisance', W / 2, 680)

    ctx.font = '14px "Fredoka", sans-serif'
    ctx.fillStyle = '#D99BAA'
    ctx.fillText(new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }), W / 2, 715)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const render = () => {
      if (canvasRef.current) {
        drawPolaroid(canvasRef.current)
      }
    }
    render()
    if ('fonts' in document) {
      document.fonts.ready.then(render)
    }
  }, [isOpen, drawPolaroid])

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    sound.playChime(880, 0.4)
    burst(e, { kind: 'sparkle', count: 12 })

    try {
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = 'for-my-favourite-menace.png'
        link.href = url
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 2000)
      }, 'image/png')
    } catch {
      const link = document.createElement('a')
      link.download = 'for-my-favourite-menace.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    setDownloaded(true)
    window.setTimeout(() => setDownloaded(false), 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cocoa/30 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="soft-shadow relative z-10 w-full max-w-sm rounded-[2.2rem] border-2 border-white bg-cream p-5 text-center text-cocoa"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close polaroid"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-cocoa/60 hover:text-cocoa"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-rose/20 text-berry">
              <Camera className="h-5 w-5" />
            </div>

            <h2 className="title mt-2 text-xl text-berry-deep">Keepsake Polaroid</h2>
            <p className="lead text-xs">Save this to your camera roll for the next time school is annoying.</p>

            {/* The Polaroid Preview Canvas */}
            <div className="mt-3 flex justify-center">
              <div className="soft-shadow overflow-hidden rounded-xl border border-white/80 bg-white p-2">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={760}
                  className="h-[250px] sm:h-[280px] w-auto rounded-md shadow-xs"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <PillButton onClick={handleDownload} className="flex-1 text-xs py-2.5">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                {downloaded ? 'Saved! 🩷' : 'Save to Camera Roll'}
              </PillButton>
            </div>

            <p className="mt-2 text-[10px] text-cocoa-soft flex items-center justify-center gap-1">
              <Heart className="h-2.5 w-2.5 text-rose fill-rose" /> Unlimited free hugs included
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
