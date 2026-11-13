'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playChessPieceThud } from '../SoundToggle';

interface SlideToConfirmProps {
  onConfirm: () => void;
  isLoading?: boolean;
  isConfirmed?: boolean;
  text?: string;
  confirmedText?: string;
  className?: string;
}

export function SlideToConfirm({
  onConfirm,
  isLoading = false,
  isConfirmed = false,
  text = 'Slide to confirm evaluation',
  confirmedText = 'Request confirmed',
  className,
}: SlideToConfirmProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setSliderWidth(el.offsetWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoading && !isConfirmed) {
      triggeredRef.current = false;
      x.set(0);
    }
  }, [isLoading, isConfirmed, x]);

  const maxDrag = Math.max(0, sliderWidth - 50);
  const opacity = useTransform(x, [0, Math.max(1, maxDrag * 0.65)], [1, 0.2]);

  const triggerConfirm = () => {
    if (triggeredRef.current || isLoading || isConfirmed) return;
    triggeredRef.current = true;
    playChessPieceThud(1.2);
    onConfirm();
  };

  const handleDrag = () => {
    if (maxDrag > 0 && x.get() >= maxDrag * 0.9) {
      triggerConfirm();
    }
  };

  const handleDragEnd = () => {
    if (!triggeredRef.current) {
      x.set(0);
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={isLoading || isConfirmed ? -1 : 0}
      aria-label={isConfirmed ? confirmedText : isLoading ? 'Submitting request' : `${text} (or press Enter to submit)`}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isLoading && !isConfirmed) {
          e.preventDefault();
          triggerConfirm();
        }
      }}
      className={cn(
        'relative h-12 w-full rounded-well bg-paper border border-rule overflow-hidden select-none flex items-center p-1 focus-visible:outline-2 focus-visible:outline-focus',
        className
      )}
    >
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center font-sans text-sm font-medium text-muted pointer-events-none px-12 text-center truncate"
      >
        {isConfirmed ? confirmedText : isLoading ? 'Submitting request...' : text}
      </motion.span>

      {!isConfirmed && !isLoading ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.05}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ x }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 h-10 w-10 rounded-md bg-accent text-accent-ink flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-accent-amber-hover transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-accent-ink" aria-hidden="true" />
        </motion.div>
      ) : (
        <div className="relative z-10 h-10 w-full rounded-md bg-paper-3 border border-rule text-ink flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-accent-green" aria-hidden="true" />
          <span className="text-sm font-sans font-medium text-ink">
            {isConfirmed ? confirmedText : 'Sending request...'}
          </span>
        </div>
      )}
    </div>
  );
}
