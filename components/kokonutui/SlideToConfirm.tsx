'use client';

import React, { useState, useRef } from 'react';
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
  confirmedText = 'Request Confirmed',
  className,
}: SlideToConfirmProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const handleDrag = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const handleWidth = 48;
      const maxDrag = containerWidth - handleWidth - 8;
      if (x.get() >= maxDrag * 0.92) {
        playChessPieceThud(1.2);
        onConfirm();
      }
    }
  };

  React.useEffect(() => {
    if (containerRef.current) {
      setSliderWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const maxDrag = Math.max(0, sliderWidth - 56);
  const opacity = useTransform(x, [0, maxDrag * 0.6], [1, 0.2]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-13 w-full rounded-lg bg-surface-deep border border-border-subtle overflow-hidden select-none flex items-center p-1',
        className
      )}
    >
      {/* Background hint label */}
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center font-mono text-xs sm:text-[13px] font-medium text-ink-muted pointer-events-none"
      >
        {isConfirmed ? confirmedText : isLoading ? 'Dispatching request...' : text}
      </motion.span>

      {/* Draggable handle */}
      {!isConfirmed && !isLoading ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.08}
          dragMomentum={false}
          onDrag={handleDrag}
          style={{ x }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 h-11 w-11 rounded-md bg-[#FCFDFF] text-[#000000] flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing hover:bg-slate-200 transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-[#000000]" />
        </motion.div>
      ) : (
        <div className="relative z-10 h-11 w-full rounded-md bg-accent-green/10 border border-accent-green/30 text-accent-green flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span className="text-xs font-mono font-semibold">{confirmedText}</span>
        </div>
      )}
    </div>
  );
}
