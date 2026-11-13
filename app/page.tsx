'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import DynamicIslandNav from '@/components/DynamicIslandNav';
import BookingModal from '@/components/BookingModal';
import SmartPreloader from '@/components/SmartPreloader';
import Hero from '@/components/sections/Hero';
import MatchReelSection from '@/components/sections/MatchReelSection';
import Method from '@/components/sections/Method';
import Access from '@/components/sections/Access';
import Footer from '@/components/sections/Footer';

const RookCanvas = dynamic(() => import('@/components/RookCanvas'), {
  ssr: false,
});

const Curriculum = dynamic(() => import('@/components/sections/Curriculum'), {
  ssr: false,
});

const SoundToggle = dynamic(() => import('@/components/SoundToggle'), {
  ssr: false,
});

const Noise = dynamic(() => import('@/components/reactbits/Noise'), {
  ssr: false,
});

const TextLoop = dynamic(() => import('@/components/reactbits/TextLoop'), {
  ssr: false,
});

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <SmartPreloader />
      <Noise fixed opacity={0.04} blendMode="overlay" fps={16} zIndex={50} />
      <SoundToggle isFloating />
      <DynamicIslandNav onOpenBooking={() => setIsBookingOpen(true)} />
      <RookCanvas />

      <main id="main">
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <div className="border-t border-rule bg-paper py-1 overflow-hidden">
          <TextLoop
            text="CALCULATE DEEPLY / PAWN ECOLOGY / PROPHYLAXIS FIRST / ENDGAME TECHNIQUE"
            shape="wave"
            speed={58}
            separator="/"
            curviness={18}
            fontSize={21}
            fontWeight={500}
            letterSpacing={2.8}
            color="#c5b6a6"
            ribbon={false}
            edgeFade={0.45}
            scrollBoost={0.35}
            pauseOnHover
            viewHeight={104}
          />
        </div>
        <MatchReelSection />
        <Method />
        <Curriculum onOpenBooking={() => setIsBookingOpen(true)} />
        <Access onOpenBooking={() => setIsBookingOpen(true)} />
        <Footer onOpenBooking={() => setIsBookingOpen(true)} />
      </main>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}

