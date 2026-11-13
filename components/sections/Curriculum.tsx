'use client';

import React from 'react';
import FlexibleAccordion from '../FlexibleAccordion';

interface CurriculumProps {
  onOpenBooking?: () => void;
}

export default function Curriculum({ onOpenBooking = () => {} }: CurriculumProps) {
  return (
    <section className="curriculum bg-canvas py-20 sm:py-28 border-t border-border-subtle" id="curriculum" data-theme="dark">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-[1]">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h2 className="reveal d1 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-ink-primary leading-[1.08]">
            Proven Rating Milestones &amp; Tactical Pedagogy
          </h2>

          <p className="reveal d2 mt-3 text-sm sm:text-base text-ink-muted leading-relaxed font-sans max-w-xl">
            Documented rating plateau breakthroughs from club to master level. How Coach Aditya&apos;s candidate calculation trees and root pawn ecology replace brittle memorization with genuine board understanding.
          </p>
        </div>

        {/* Flexible Accordion (Showcase Tabs) */}
        <div className="reveal d3">
          <FlexibleAccordion onOpenBooking={onOpenBooking} />
        </div>
      </div>
    </section>
  );
}
