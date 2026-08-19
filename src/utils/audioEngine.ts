/**
 * Native Web Audio API Sound Engine for D.U.E.R.M.E.™
 * Generates pure Binaural Beats (Delta 1.5Hz, Theta 4.5Hz, Solfeggio 528Hz)
 * and procedural Pink Noise & Rain acoustics.
 */

class SoundTherapyEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  private isPlaying: boolean = false;
  private currentPresetId: string | null = null;
  private timerId: number | null = null;
  private onTimerTick?: (remainingSeconds: number) => void;
  private onPlaybackEnd?: () => void;
  private remainingSeconds: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.linearRampToValueAtTime(clamped, this.ctx.currentTime + 0.05);
    }
  }

  public playBinaural(carrierFreq: number, beatFreq: number, presetId: string, durationMinutes: number = 30) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentPresetId = presetId;
    this.isPlaying = true;

    // Stereo Panner or Channel Merger for true stereo separation
    const merger = this.ctx.createChannelMerger(2);

    const leftFreq = carrierFreq;
    const rightFreq = carrierFreq + beatFreq;

    // Left Ear Oscillator
    this.leftOsc = this.ctx.createOscillator();
    this.leftOsc.type = 'sine';
    this.leftOsc.frequency.setValueAtTime(leftFreq, this.ctx.currentTime);

    const leftGain = this.ctx.createGain();
    leftGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0); // Connect to Left channel

    // Right Ear Oscillator
    this.rightOsc = this.ctx.createOscillator();
    this.rightOsc.type = 'sine';
    this.rightOsc.frequency.setValueAtTime(rightFreq, this.ctx.currentTime);

    const rightGain = this.ctx.createGain();
    rightGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1); // Connect to Right channel

    // Connect merged stereo to master
    merger.connect(this.masterGain);

    this.leftOsc.start();
    this.rightOsc.start();

    // Start countdown timer
    this.startTimer(durationMinutes);
  }

  public playPinkNoise(presetId: string, durationMinutes: number = 45) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentPresetId = presetId;
    this.isPlaying = true;

    // Generate Pink Noise using Voss-McCartney or Paul Kellet filter algorithm
    const bufferSize = 4096;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    // Use ScriptProcessor / AudioBufferSource
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 2);
    node.onaudioprocess = (e) => {
      const outputL = e.outputBuffer.getChannelData(0);
      const outputR = e.outputBuffer.getChannelData(1);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        const sample = pink * 0.08; // scale down
        outputL[i] = sample;
        outputR[i] = sample;
      }
    };

    // Filter to warm low-pass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    node.connect(filter);
    filter.connect(this.masterGain);
    this.noiseNode = node;

    this.startTimer(durationMinutes);
  }

  public playRainNoise(presetId: string, durationMinutes: number = 30) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentPresetId = presetId;
    this.isPlaying = true;

    // Multi-pole filtered noise with gentle slow wave LFO to simulate gentle rainfall / ocean waves
    const bufferSize = 4096;
    const node = this.ctx.createScriptProcessor(bufferSize, 1, 2);
    let lastOut = 0.0;

    node.onaudioprocess = (e) => {
      const outputL = e.outputBuffer.getChannelData(0);
      const outputR = e.outputBuffer.getChannelData(1);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise integration
        const brown = (lastOut + (0.02 * white)) / 1.02;
        lastOut = brown;
        const sample = (brown * 0.3 + white * 0.03);
        outputL[i] = sample;
        outputR[i] = sample;
      }
    };

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    // LFO for wave modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave breath
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    node.connect(filter);
    filter.connect(this.masterGain);
    this.noiseNode = node;

    this.startTimer(durationMinutes);
  }

  public playTone(freq: number, durationSeconds: number = 2) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSeconds);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + durationSeconds);
  }

  private startTimer(durationMinutes: number) {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.remainingSeconds = durationMinutes * 60;
    if (this.onTimerTick) {
      this.onTimerTick(this.remainingSeconds);
    }

    this.timerId = window.setInterval(() => {
      this.remainingSeconds -= 1;
      if (this.onTimerTick) {
        this.onTimerTick(this.remainingSeconds);
      }
      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onPlaybackEnd) {
          this.onPlaybackEnd();
        }
      }
    }, 1000);
  }

  public setCallbacks(onTick: (rem: number) => void, onEnd: () => void) {
    this.onTimerTick = onTick;
    this.onPlaybackEnd = onEnd;
  }

  public stop() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.leftOsc) {
      try { this.leftOsc.stop(); this.leftOsc.disconnect(); } catch { /* ignore */ }
      this.leftOsc = null;
    }
    if (this.rightOsc) {
      try { this.rightOsc.stop(); this.rightOsc.disconnect(); } catch { /* ignore */ }
      this.rightOsc = null;
    }
    if (this.noiseNode) {
      try { this.noiseNode.disconnect(); } catch { /* ignore */ }
      this.noiseNode = null;
    }
    this.isPlaying = false;
    this.currentPresetId = null;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      presetId: this.currentPresetId,
      remainingSeconds: this.remainingSeconds,
    };
  }
}

export const audioEngine = new SoundTherapyEngine();
