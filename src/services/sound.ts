/**
 * Web Audio API synthesized sound generator & mobile haptic engine.
 * Zero external audio files, zero latency, 100% lightweight and instant.
 */

class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = true

  constructor() {
    // sound is muted by default to respect privacy and autoplay policies
    try {
      const saved = localStorage.getItem('sound_enabled')
      if (saved === 'true') {
        this.muted = false
      }
    } catch {
      // ignore
    }
  }

  public isMuted(): boolean {
    return this.muted
  }

  public toggleMute(): boolean {
    this.muted = !this.muted
    try {
      localStorage.setItem('sound_enabled', this.muted ? 'false' : 'true')
    } catch {
      // ignore
    }
    if (!this.muted) {
      this.initCtx()
      this.playChime(523.25, 0.2) // pleasant C5 confirmation chime
    }
    return this.muted
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // --- Haptics (Vibration API for mobile phones) ---
  public vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // unsupported / blocked
      }
    }
  }

  // --- Cozy Sound Synthesizers ---

  /** Soft music box / kalimba chime note */
  public playChime(freq: number = 659.25, duration: number = 0.45) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    // Warm sine wave with subtle bell overtones
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    // Soft chime envelope: fast attack, gentle resonant ring-out
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + duration)
  }

  /** Soft yarn stitch pop */
  public playPop() {
    this.vibrate([12])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.09)
  }

  /** Soft plushie purr / affectionate tap */
  public playPurr() {
    this.vibrate([16, 35, 24])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    // Two gentle harmonic chimes (e.g. E5 -> G#5)
    this.playChime(659.25, 0.35)
    window.setTimeout(() => this.playChime(830.61, 0.45), 90)
  }

  /** Paper seal crack & unfold */
  public playRustle() {
    this.vibrate([25, 20, 45])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    // Gentle chord
    this.playChime(440, 0.4)
    window.setTimeout(() => this.playChime(554.37, 0.45), 110)
    window.setTimeout(() => this.playChime(659.25, 0.6), 220)
  }

  /** Mechanical vending click & dispense */
  public playVending() {
    this.vibrate([20, 25, 20, 25, 40])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.setValueAtTime(120, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.17)

    window.setTimeout(() => {
      this.playChime(783.99, 0.35) // G5
      window.setTimeout(() => this.playChime(1046.5, 0.5), 120) // C6
    }, 280)
  }

  /** Sarcastic complaint shredder crunch */
  public playShred() {
    this.vibrate([15, 15, 15, 15, 15, 15, 30])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const notes = [440, 415.3, 392, 369.99, 523.25]
    notes.forEach((freq, idx) => {
      window.setTimeout(() => this.playChime(freq, 0.15), idx * 60)
    })
  }

  /** Warm harmonic hug chord */
  public playHug() {
    this.vibrate([30, 40, 60, 40, 90])
    if (this.muted) return
    // Beautiful warm C-major 9th arpeggio
    const chord = [261.63, 329.63, 392.0, 493.88, 587.33]
    chord.forEach((freq, idx) => {
      window.setTimeout(() => this.playChime(freq, 0.8), idx * 85)
    })
  }
}

export const sound = new SoundEngine()
