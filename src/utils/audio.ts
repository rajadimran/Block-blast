/**
 * Imran Blast - Procedural Web Audio Synthesizer & Haptics Engine
 * 100% original, crisp, satisfying FM & subtractive audio synthesis.
 * Zero external audio files required, ultra-low latency, 100% offline-ready.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying = false;
  private soundEnabled = true;
  private musicEnabled = true;
  private vibrationEnabled = true;
  private soundVolume = 0.85;
  private musicVolume = 0.45;
  private lastDragTickTime = 0;

  constructor() {
    // AudioContext is initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.soundVolume;
        this.musicGain.gain.value = this.musicVolume;
        this.sfxGain.connect(this.ctx.destination);
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateSettings(
    soundEnabled: boolean,
    musicEnabled: boolean,
    vibrationEnabled: boolean,
    soundVolume = 0.85,
    musicVolume = 0.45
  ) {
    this.soundEnabled = soundEnabled;
    this.musicEnabled = musicEnabled;
    this.vibrationEnabled = vibrationEnabled;
    this.soundVolume = soundVolume;
    this.musicVolume = musicVolume;

    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(soundEnabled ? soundVolume : 0, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(musicEnabled ? musicVolume : 0, this.ctx.currentTime);
    }

    if (musicEnabled && !this.isBgmPlaying) {
      this.startBgm();
    } else if (!musicEnabled && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  // Haptic feedback with safety checks
  public vibrate(pattern: number | number[] = 15) {
    if (!this.vibrationEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors
    }
  }

  // 1. Button Click: Crisp, tactile bubble-pop transient
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.035);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.04);
    this.vibrate(6);
  }

  // 2. Block Pickup: Soft airy suction & ascending chime
  public playPickup() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(760, t + 0.05);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.065);
    this.vibrate(10);
  }

  // 3. Block Dragging: Subtle granular acoustic tick when snapping over a new grid cell
  public playDragTick() {
    if (!this.soundEnabled) return;
    const now = Date.now();
    if (now - this.lastDragTickTime < 60) return; // Throttle to prevent audio stutter
    this.lastDragTickTime = now;

    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.015);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.02);
    this.vibrate(4);
  }

  // 4. Successful Block Placement: Satisfying dual sub-bass thud + crystal click
  public playPlace() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // Sub-bass resonance
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(260, t);
    sub.frequency.exponentialRampToValueAtTime(70, t + 0.09);
    subGain.gain.setValueAtTime(0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(t);
    sub.stop(t + 0.11);

    // High snap transient
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(800, t);
    snap.frequency.exponentialRampToValueAtTime(1400, t + 0.04);
    snapGain.gain.setValueAtTime(0.22, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    snap.connect(snapGain);
    snapGain.connect(this.sfxGain);
    snap.start(t);
    snap.stop(t + 0.05);

    this.vibrate(15);
  }

  // 5. Invalid Placement: Gentle soft spring wobble
  public playInvalid() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.1);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);
    this.vibrate([10, 25, 10]);
  }

  // 6 & 7 & 8. Row / Column / Multi-Line Clear
  public playClear(linesCount: number, comboCount: number) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // Harmonic pentatonic frequencies (Eb Pentatonic Major)
    const scale = [311.13, 349.23, 392.0, 466.16, 523.25, 622.25, 698.46, 783.99, 932.33, 1046.5, 1244.5];
    const baseIdx = Math.min(scale.length - 5, Math.max(0, (comboCount - 1) * 2));

    const noteCount = Math.min(7, Math.max(3, linesCount + 2));
    for (let i = 0; i < noteCount; i++) {
      const noteTime = t + i * 0.045;
      const freq = scale[(baseIdx + i) % scale.length];

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      noteGain.gain.setValueAtTime(0.38, noteTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(noteGain);
      noteGain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    }

    // Heavy bass impact for multi-line clears (>= 2 lines)
    if (linesCount >= 2) {
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'triangle';
      boom.frequency.setValueAtTime(200, t);
      boom.frequency.exponentialRampToValueAtTime(35, t + 0.22);
      boomGain.gain.setValueAtTime(0.55, t);
      boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      boom.connect(boomGain);
      boomGain.connect(this.sfxGain);
      boom.start(t);
      boom.stop(t + 0.26);
    }

    if (linesCount >= 3 || comboCount >= 3) {
      this.vibrate([20, 25, 35, 20, 50]);
    } else {
      this.vibrate([20, 30, 25]);
    }
  }

  // 9. Combo x2
  public playCombo2() {
    this.playComboSpecific(2, [523.25, 659.25]); // C5 -> E5
  }

  // 10. Combo x3
  public playCombo3() {
    this.playComboSpecific(3, [523.25, 659.25, 783.99]); // C5 -> E5 -> G5
  }

  // 11. Combo x5+
  public playCombo5() {
    this.playComboSpecific(5, [523.25, 659.25, 783.99, 1046.5, 1318.51]); // Full C Major Arpeggio Fanfare
  }

  private playComboSpecific(level: number, notes: number[]) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });

    this.vibrate(level >= 5 ? [25, 35, 45, 60] : [20, 35, 25]);
  }

  // 12. New High Score Fanfare
  public playHighScore() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Victory fanfare notes: C5, E5, G5, C6 triumph
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.4, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.48);
    });

    this.vibrate([40, 50, 40, 60, 40, 100]);
  }

  // 13. Coin Collection
  public playCoin() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = t + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.2);
    });
    this.vibrate(10);
  }

  // 14. Daily Reward
  public playDailyReward() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const chord = [392.0, 493.88, 587.33, 783.99, 987.77]; // G Major
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const time = t + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.45);
    });
    this.vibrate([30, 40, 50, 40]);
  }

  // 15. Level Up
  public playLevelUp() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const chord = [440, 554.37, 659.25, 880, 1108.73]; // A Major triumph
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const time = t + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.38, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.5);
    });
    this.vibrate([35, 50, 35, 80]);
  }

  // 16. Achievement Unlocked
  public playAchievement() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const time = t + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.38);
    });
    this.vibrate([25, 40, 50]);
  }

  // 17. Game Over
  public playGameOver() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [392.0, 369.99, 349.23, 311.13, 261.63]; // Descending mellow retro progression
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const time = t + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.35);
    });
    this.vibrate([40, 80, 60]);
  }

  // Wheel tick
  public playWheelTick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.02);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.03);
    this.vibrate(6);
  }

  // Power-up Hammer
  public playHammer() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.18);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.22);
    this.vibrate([30, 50, 20]);
  }

  // Power-up Bomb
  public playBomb() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.35);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.45);
    this.vibrate([50, 70, 90]);
  }

  // 18. Background Music Generator (Ambient Lo-Fi Chill Synth Progression)
  public startBgm() {
    if (!this.musicEnabled || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    this.isBgmPlaying = true;
    let step = 0;
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
    ];

    const playChordStep = () => {
      if (!this.isBgmPlaying || !this.musicEnabled || !this.ctx || !this.musicGain) return;
      const currentChord = chords[step % chords.length];
      const t = this.ctx.currentTime;

      currentChord.forEach(freq => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.5, t); // Warm octave

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.035, t + 0.4);
        gain.gain.linearRampToValueAtTime(0.0001, t + 2.2);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 2.3);
      });

      step++;
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, 2400);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
