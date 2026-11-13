'use client';

import { useState, useEffect } from 'react';

let audioCtx: AudioContext | null = null;
let globalSoundEnabled = false;

export function initAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playChessPieceThud(volumeMultiplier = 1.0) {
  if (!globalSoundEnabled) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;

    // 1. Primary impact transient (wood/felt impact click)
    const noiseBuffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 0.016), audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (output.length * 0.3));
    }

    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1350, now);
    noiseFilter.Q.setValueAtTime(3.2, now);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.22 * volumeMultiplier, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noiseNode.start(now);

    // 2. Resonant Staunton wooden body decay (low pitch dive)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(44, now + 0.075);

    oscGain.gain.setValueAtTime(0.3 * volumeMultiplier, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.085);
  } catch {
    // AudioContext policy or playback error caught gracefully
  }
}

interface SoundToggleProps {
  className?: string;
  isFloating?: boolean;
}

export default function SoundToggle({ className = '', isFloating = false }: SoundToggleProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    globalSoundEnabled = isActive;
  }, [isActive]);

  const handleToggle = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    globalSoundEnabled = nextState;
    initAudioContext();
    if (nextState) {
      playChessPieceThud(1.2);
    }
  };

  const positioningClass = isFloating
    ? 'fixed z-30 left-[var(--pad)] bottom-[22px] max-[760px]:bottom-[calc(18px+env(safe-area-inset-bottom,0px))] bg-surface-card/90 backdrop-blur-md border border-border-subtle shadow-lg px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-mono font-medium transition-[border-color,color] duration-200 hover:border-border-strong text-ink-muted hover:text-ink-primary'
    : 'relative inline-flex items-center justify-center p-2 rounded-md';

  return (
    <button
      id="sound-toggle"
      onClick={handleToggle}
      className={`sound-toggle cursor-pointer select-none active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary ${positioningClass} ${
        isActive ? 'is-active text-accent-amber' : 'text-ink-muted hover:text-ink-primary'
      } ${className}`}
      aria-label={isActive ? 'Disable acoustic chess feedback' : 'Enable acoustic chess feedback'}
      title={isActive ? 'Tactile audio enabled (click to mute)' : 'Tactile audio disabled (click to unmute)'}
    >
      {isActive ? (
        /* Unmuted Icon */
        <svg className="w-3.5 h-3.5 transition-transform duration-300 text-accent-amber" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
        </svg>
      ) : (
        /* Muted Icon */
        <svg className="w-3.5 h-3.5 transition-transform duration-300 text-ink-muted" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
        </svg>
      )}
      {isFloating && (
        <span className="font-semibold select-none">
          {isActive ? 'Audio On' : 'Tactile Audio'}
        </span>
      )}
    </button>
  );
}
