'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Magnet from './reactbits/Magnet';

let audioCtx: AudioContext | null = null;
let globalSoundEnabled = false;

export function initAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
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

    const noiseBuffer = audioCtx.createBuffer(
      1,
      Math.floor(audioCtx.sampleRate * 0.016),
      audioCtx.sampleRate
    );
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
    // AudioContext policy caught gracefully
  }
}

interface SoundToggleProps {
  className?: string;
  isFloating?: boolean;
}

export default function SoundToggle({
  className = '',
  isFloating = false,
}: SoundToggleProps) {
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

  const buttonNode = (
    <button
      id="sound-toggle"
      type="button"
      onClick={handleToggle}
      aria-pressed={isActive}
      className={`cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
        isFloating
          ? 'bg-paper-2 border border-rule w-11 h-11 sm:w-auto sm:min-h-[44px] sm:px-4 rounded-pill flex items-center justify-center gap-2 text-sm font-sans font-medium text-ink transition-colors duration-200 hover:bg-paper-3'
          : 'relative inline-flex items-center justify-center p-2 rounded-well'
      } ${className}`}
      aria-label={
        isActive ? 'Disable acoustic chess feedback' : 'Enable acoustic chess feedback'
      }
    >
      {isActive ? (
        <Volume2 className="w-4 h-4 text-ink shrink-0" aria-hidden="true" />
      ) : (
        <VolumeX className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
      )}
      {isFloating && (
        <span className={`hidden sm:inline ${isActive ? 'text-ink' : 'text-muted'}`}>
          {isActive ? 'Sound on' : 'Tactile sound'}
        </span>
      )}
    </button>
  );

  if (isFloating) {
    return (
      <div className="fixed z-30 left-[var(--gutter)] bottom-[max(1rem,env(safe-area-inset-bottom))]">
        <Magnet padding={44} magnetStrength={4} maxOffset={12}>
          {buttonNode}
        </Magnet>
      </div>
    );
  }

  return buttonNode;
}

