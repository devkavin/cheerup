/**
 * Handcrafted Web Audio synthesizer & tactile haptic engine.
 * Generates warm, velvety music-box and kalimba acoustics using
 * dual-harmonic oscillators and gentle low-pass biquad filters.
 * Zero external audio assets, zero latency, 100% lightweight.
 */

// Tuned F-major / D-minor cozy pentatonic scale frequencies (Hz)
const PENTATONIC_SCALE = [
  349.23, // F4
  392.0, // G4
  440.0, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.0, // A5
  1046.5, // C6
  1174.66, // D6
  1318.51, // E6
  1396.91, // F6
  1567.98, // G6
  1760.0, // A6
  2093.0, // C7
]

class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = true
  private stitchIndex: number = 0

  constructor() {
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
      // Welcoming two-note confirmation chime
      this.playNote(523.25, 0.45, 0.16)
      window.setTimeout(() => this.playNote(659.25, 0.65, 0.18), 90)
    }
    return this.muted
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // --- Haptics (Vibration API for mobile devices) ---
  public vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern)
      } catch {
        // unsupported / blocked
      }
    }
  }

  /**
   * Warm, soft music-box note with dual harmonic oscillators
   * and a warm biquad lowpass filter.
   */
  public playNote(freq: number = 659.25, duration: number = 0.5, velocity: number = 0.18) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Filter to eliminate harsh digital edges and give warm wooden resonance
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(Math.min(freq * 3.2, 2400), now)
    filter.Q.setValueAtTime(1.2, now)

    // Master gain for the note
    const masterGain = this.ctx.createGain()
    masterGain.gain.setValueAtTime(0.0001, now)
    // Soft attack (5ms) prevents clicks
    masterGain.gain.linearRampToValueAtTime(velocity, now + 0.006)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    // Primary fundamental oscillator (warm sine)
    const osc1 = this.ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(freq, now)

    // Secondary overtone oscillator (bell harmonic at 2x frequency, softer)
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(freq * 2, now)
    gain2.gain.setValueAtTime(0.18, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6)

    osc1.connect(masterGain)
    osc2.connect(gain2)
    gain2.connect(masterGain)

    masterGain.connect(filter)
    filter.connect(this.ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + duration)
    osc2.stop(now + duration)
  }

  /** Alias for backward compatibility */
  public playChime(freq: number = 659.25, duration: number = 0.45) {
    this.playNote(freq, duration, 0.18)
  }

  /**
   * Soft yarn stitch pop with melodious ascending pentatonic variation!
   * Stitches 1 to 16 weave a gentle music-box tune as the heart is made.
   */
  public playPop(rowIndex?: number) {
    this.vibrate(12)
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const idx = typeof rowIndex === 'number' ? rowIndex : this.stitchIndex
    this.stitchIndex = (this.stitchIndex + 1) % PENTATONIC_SCALE.length
    const noteFreq = PENTATONIC_SCALE[idx % PENTATONIC_SCALE.length]

    // 1. Soft acoustic crochet pop
    const popOsc = this.ctx.createOscillator()
    const popGain = this.ctx.createGain()
    const popFilter = this.ctx.createBiquadFilter()

    popFilter.type = 'lowpass'
    popFilter.frequency.setValueAtTime(800, now)

    popOsc.type = 'triangle'
    popOsc.frequency.setValueAtTime(260, now)
    popOsc.frequency.exponentialRampToValueAtTime(540, now + 0.05)

    popGain.gain.setValueAtTime(0.001, now)
    popGain.gain.linearRampToValueAtTime(0.12, now + 0.005)
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

    popOsc.connect(popGain)
    popGain.connect(popFilter)
    popFilter.connect(this.ctx.destination)

    popOsc.start(now)
    popOsc.stop(now + 0.075)

    // 2. Accompanying soft music-box note
    this.playNote(noteFreq, 0.45, 0.12)
  }

  /**
   * Soft plushie purr / affectionate tap with cozy harmonic variation
   * and a warm physical low-frequency purr vibration.
   */
  public playPurr() {
    this.vibrate([16, 30, 22])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Low throat purr vibration
    const purrOsc = this.ctx.createOscillator()
    const purrGain = this.ctx.createGain()
    const purrFilter = this.ctx.createBiquadFilter()

    purrFilter.type = 'lowpass'
    purrFilter.frequency.setValueAtTime(160, now)

    purrOsc.type = 'sine'
    purrOsc.frequency.setValueAtTime(52, now)
    purrOsc.frequency.linearRampToValueAtTime(68, now + 0.08)
    purrOsc.frequency.linearRampToValueAtTime(48, now + 0.18)

    purrGain.gain.setValueAtTime(0.001, now)
    purrGain.gain.linearRampToValueAtTime(0.14, now + 0.02)
    purrGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    purrOsc.connect(purrGain)
    purrGain.connect(purrFilter)
    purrFilter.connect(this.ctx.destination)

    purrOsc.start(now)
    purrOsc.stop(now + 0.23)

    // Gentle random fifth/sixth chord pair
    const purrPairs = [
      [587.33, 783.99], // D5 -> G5
      [659.25, 880.0], // E5 -> A5
      [523.25, 659.25], // C5 -> E5
      [698.46, 880.0], // F5 -> A5
    ]
    const pair = purrPairs[Math.floor(Math.random() * purrPairs.length)]

    this.playNote(pair[0], 0.35, 0.14)
    window.setTimeout(() => this.playNote(pair[1], 0.55, 0.16), 85)
  }

  /**
   * Sincere Lullaby Chord: Special music-box chord for Sir Fluffington's
   * 6th tap (hair compliment). Warm, heartfelt, and deeply comforting.
   */
  public playSincereLullaby() {
    this.vibrate([25, 40, 50, 40, 80])
    if (this.muted) return

    // Soft warm Eb major 9th arpeggio that gently cascades
    const notes = [
      { freq: 311.13, delay: 0, dur: 1.6, vel: 0.2 }, // Eb4
      { freq: 392.0, delay: 140, dur: 1.6, vel: 0.18 }, // G4
      { freq: 466.16, delay: 280, dur: 1.8, vel: 0.18 }, // Bb4
      { freq: 587.33, delay: 420, dur: 2.0, vel: 0.22 }, // D5
      { freq: 622.25, delay: 580, dur: 2.2, vel: 0.2 }, // Eb5
    ]

    notes.forEach((n) => {
      window.setTimeout(() => this.playNote(n.freq, n.dur, n.vel), n.delay)
    })
  }

  /** Tactile button tap with felt softness */
  public playButtonTap() {
    this.vibrate(8)
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(750, now)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(380, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

    osc.connect(gain)
    gain.connect(filter)
    filter.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.055)
  }

  /** Paper seal crack & delicate letter unfolding */
  public playRustle() {
    this.vibrate([25, 20, 45])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    // Gentle wax crack
    this.playButtonTap()

    // Delicate 3-note music-box chord
    window.setTimeout(() => this.playNote(440, 0.45, 0.15), 60)
    window.setTimeout(() => this.playNote(554.37, 0.55, 0.16), 180)
    window.setTimeout(() => this.playNote(659.25, 0.75, 0.18), 310)
  }

  /** Sweet-shop mechanical clink & sweet bell */
  public playVending() {
    this.vibrate([18, 25, 18, 25, 35])
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Soft mechanical gear click
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(450, now)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(190, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(filter)
    filter.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)

    // Sweet gashapon drop chime
    window.setTimeout(() => {
      this.playNote(783.99, 0.45, 0.18) // G5
      window.setTimeout(() => this.playNote(1046.5, 0.65, 0.2), 110) // C6
    }, 240)
  }

  /** Playful grievance shredder + celebration glockenspiel */
  public playShred() {
    this.vibrate([12, 16, 12, 16, 12, 16, 28])
    if (this.muted) return

    // Quick playful micro-step crunch
    const notes = [523.25, 493.88, 440.0, 392.0, 349.23]
    notes.forEach((freq, idx) => {
      window.setTimeout(() => this.playNote(freq, 0.12, 0.12), idx * 55)
    })

    // Triumphant resolution chime
    window.setTimeout(() => {
      this.playNote(659.25, 0.6, 0.18)
      window.setTimeout(() => this.playNote(880.0, 0.8, 0.22), 90)
    }, 380)
  }

  /** Warm, velvety plushie hug chord */
  public playHug() {
    this.vibrate([25, 35, 55, 35, 80])
    if (this.muted) return

    // Lush, multi-voice F-Major 9 arpeggio that gently cascades and sustains
    const chord = [
      { freq: 349.23, delay: 0, dur: 1.4 }, // F4
      { freq: 440.0, delay: 80, dur: 1.5 }, // A4
      { freq: 523.25, delay: 160, dur: 1.6 }, // C5
      { freq: 659.25, delay: 240, dur: 1.8 }, // E5
      { freq: 698.46, delay: 320, dur: 2.0 }, // F5
      { freq: 880.0, delay: 410, dur: 2.2 }, // A5
    ]
    chord.forEach((n) => {
      window.setTimeout(() => this.playNote(n.freq, n.dur, 0.15), n.delay)
    })
  }
}

export const sound = new SoundEngine()
