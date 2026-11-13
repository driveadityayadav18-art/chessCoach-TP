'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import DynamicIslandNav from '@/components/DynamicIslandNav';
import BookingModal from '@/components/BookingModal';
import Hero from '@/components/sections/Hero';
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

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <SoundToggle isFloating />
      <DynamicIslandNav onOpenBooking={() => setIsBookingOpen(true)} />
      <RookCanvas />

      <main>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
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
