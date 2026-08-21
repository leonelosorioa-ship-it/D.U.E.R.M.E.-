// Web Audio API Engine for D.U.E.R.M.E.™ Mujer
// Produces native binaural beats (Delta 1.5Hz, Theta 4.5Hz), pink noise, and acoustic chimes

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentPresetId: string | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { [key: string]: any } = {};
  private timerInterval: number | null = null;
  private remainingSeconds = 0;
  private onTickCallback?: (secondsLeft: number) => void;
  private onEndCallback?: () => void;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCallbacks(onTick?: (secondsLeft: number) => void, onEnd?: () => void) {
    this.onTickCallback = onTick;
    this.onEndCallback = onEnd;
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const safeVol = Math.max(0.01, Math.min(volume, 1));
      this.masterGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    try {
      if (this.masterGain && this.ctx) {
        // Smooth fade out
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }

      setTimeout(() => {
        // Stop oscillators & disconnect
        if (this.activeNodes.leftOsc) {
          this.activeNodes.leftOsc.stop();
          this.activeNodes.leftOsc.disconnect();
        }
        if (this.activeNodes.rightOsc) {
          this.activeNodes.rightOsc.stop();
          this.activeNodes.rightOsc.disconnect();
        }
        if (this.activeNodes.noiseNode) {
          this.activeNodes.noiseNode.disconnect();
        }
        if (this.activeNodes.lfo) {
          this.activeNodes.lfo.stop();
          this.activeNodes.lfo.disconnect();
        }
        this.activeNodes = {};
        this.isPlaying = false;
        this.currentPresetId = null;
      }, 550);
    } catch (e) {
      console.warn('Audio stop error:', e);
      this.isPlaying = false;
      this.currentPresetId = null;
    }
  }

  // Play true binaural stereo beat: Left channel = carrier, Right channel = carrier + beatFreq
  public playBinaural(carrierFreq: number, beatFreq: number, presetId: string, durationMinutes = 30) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentPresetId = presetId;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 1.2);
    this.masterGain.connect(this.ctx.destination);

    // Left channel
    const leftOsc = this.ctx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(carrierFreq, this.ctx.currentTime);

    const leftPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (leftPanner) leftPanner.pan.setValueAtTime(-1, this.ctx.currentTime);

    // Right channel
    const rightOsc = this.ctx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(carrierFreq + beatFreq, this.ctx.currentTime);

    const rightPanner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (rightPanner) rightPanner.pan.setValueAtTime(1, this.ctx.currentTime);

    // Soft low pass filter for warm tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    if (leftPanner && rightPanner) {
      leftOsc.connect(leftPanner);
      leftPanner.connect(filter);

      rightOsc.connect(rightPanner);
      rightPanner.connect(filter);
    } else {
      leftOsc.connect(filter);
      rightOsc.connect(filter);
    }

    filter.connect(this.masterGain);

    leftOsc.start();
    rightOsc.start();

    this.activeNodes = { leftOsc, rightOsc, filter, leftPanner, rightPanner };

    this.startTimer(durationMinutes);
  }

  // Synthesize Organic Pink Noise (1/f) using Buffer and Paul Kellet filter
  public playPinkNoise(presetId: string, durationMinutes = 30) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentPresetId = presetId;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 1.5);
    this.masterGain.connect(this.ctx.destination);

    const bufferSize = 4096;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);

    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    };

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    node.connect(filter);
    filter.connect(this.masterGain);

    this.activeNodes = { noiseNode: node, filter };
    this.startTimer(durationMinutes);
  }

  // Soft Ambient Rain Waves Generator
  public playRainNoise(presetId: string, durationMinutes = 30) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentPresetId = presetId;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);
    this.masterGain.connect(this.ctx.destination);

    const bufferSize = 4096;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
    };

    // Low pass + band pass for rainfall resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    // LFO for organic rhythmic ocean / rain swell
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8 second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    node.connect(filter);
    filter.connect(this.masterGain);

    this.activeNodes = { noiseNode: node, filter, lfo, lfoGain };
    this.startTimer(durationMinutes);
  }

  // Play gentle bell/chime for breath guide and milestones
  public playChime(freq = 528, duration = 1.2) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  private startTimer(durationMinutes: number) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.remainingSeconds = durationMinutes * 60;

    this.timerInterval = window.setInterval(() => {
      this.remainingSeconds -= 1;
      if (this.onTickCallback) {
        this.onTickCallback(this.remainingSeconds);
      }
      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onEndCallback) this.onEndCallback();
      }
    }, 1000);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      presetId: this.currentPresetId,
      remainingSeconds: this.remainingSeconds,
    };
  }
}

export const audioCues = new AudioEngine();
