'use client';

import React, { useMemo, useRef, useEffect, type RefObject } from 'react';

export interface VariableProximityProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  as?: 'span' | 'p' | 'h2' | 'h3' | 'h4';
}

interface AxisPair {
  axis: string;
  fromValue: number;
  toValue: number;
}

function parseFontVariationSettings(settingsStr: string): Map<string, number> {
  const map = new Map<string, number>();
  settingsStr.split(',').forEach((entry) => {
    const trimmed = entry.trim();
    if (!trimmed) return;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) return;
    const axis = parts[0].replace(/['"]/g, '');
    const value = parseFloat(parts[1]);
    if (axis && !Number.isNaN(value)) {
      map.set(axis, value);
    }
  });
  return map;
}

export default function VariableProximity({
  label,
  fromFontVariationSettings = "'wght' 400",
  toFontVariationSettings = "'wght' 750",
  containerRef,
  radius = 85,
  falloff = 'gaussian',
  className = '',
  as: Component = 'span',
}: VariableProximityProps) {
  const localRef = useRef<HTMLElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false });

  const parsedSettings = useMemo<AxisPair[]>(() => {
    const fromMap = parseFontVariationSettings(fromFontVariationSettings);
    const toMap = parseFontVariationSettings(toFontVariationSettings);
    return Array.from(fromMap.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toMap.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const words = useMemo(() => label.split(' '), [label]);

  useEffect(() => {
    const targetContainer = containerRef?.current ?? localRef.current;
    if (!targetContainer) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced) return;

    let rafId = 0;

    const measureCenters = () => {
      centersRef.current = letterRefs.current.map((span) => {
        if (!span) return { x: 0, y: 0 };
        const r = span.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const calcFalloff = (distance: number) => {
      const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
      if (falloff === 'exponential') return norm * norm;
      if (falloff === 'gaussian') return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      return norm;
    };

    const paint = () => {
      rafId = 0;
      const { x: px, y: py, active } = pointerRef.current;
      letterRefs.current.forEach((span, idx) => {
        if (!span) return;
        if (!active) {
          span.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }
        const center = centersRef.current[idx];
        if (!center) return;
        const dist = Math.hypot(px - center.x, py - center.y);
        if (dist >= radius) {
          span.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }
        const t = calcFalloff(dist);
        const setting = parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const val = fromValue + (toValue - fromValue) * t;
            return `'${axis}' ${Math.round(val)}`;
          })
          .join(', ');
        span.style.fontVariationSettings = setting;
      });
    };

    const schedulePaint = () => {
      if (!rafId) rafId = requestAnimationFrame(paint);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      measureCenters();
      schedulePaint();
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      schedulePaint();
    };

    measureCenters();
    targetContainer.addEventListener('pointermove', handlePointerMove, { passive: true });
    targetContainer.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', measureCenters, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      targetContainer.removeEventListener('pointermove', handlePointerMove);
      targetContainer.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', measureCenters);
    };
  }, [containerRef, fromFontVariationSettings, parsedSettings, radius, falloff]);

  let letterCounter = 0;

  return (
    <Component
      ref={localRef as React.RefObject<never>}
      className={`inline ${className}`.trim()}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {words.map((word, wIdx) => (
          <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap">
            {word.split('').map((char) => {
              const idx = letterCounter++;
              return (
                <span
                  key={idx}
                  ref={(el) => {
                    letterRefs.current[idx] = el;
                  }}
                  style={{ fontVariationSettings: fromFontVariationSettings }}
                  className="inline-block transition-[font-variation-settings] duration-75"
                >
                  {char}
                </span>
              );
            })}
            {wIdx < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </span>
    </Component>
  );
}
