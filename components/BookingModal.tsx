'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playChessPieceThud } from './SoundToggle';
import { SlideToConfirm } from './kokonutui/SlideToConfirm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '1400-1800',
    goal: 'Positional understanding',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus trap and Esc key support
  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setErrorMessage('');
      return;
    }

    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (status === 'submitting') return;
    setStatus('submitting');
    setErrorMessage('');
    playChessPieceThud(0.8);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit consultation request.');
      }

      setStatus('success');
      playChessPieceThud(1.3);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => {
            playChessPieceThud(0.7);
            onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative w-full max-w-lg p-7 sm:p-8 bg-surface-card text-ink-primary rounded-xl shadow-2xl border border-border-strong overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                playChessPieceThud(0.7);
                onClose();
              }}
              className="absolute top-6 right-6 w-8 h-8 rounded-md flex items-center justify-center text-ink-muted hover:text-ink-primary active:scale-90 hover:bg-surface-elevated transition-colors focus-visible:outline-2 focus-visible:outline-ink-primary cursor-pointer border border-transparent hover:border-border-subtle"
              aria-label="Close modal"
            >
              ✕
            </button>

            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-surface-deep text-accent-green rounded-full flex items-center justify-center text-xl font-semibold border border-accent-green/30">
                  ✓
                </div>
                <h3 id="booking-modal-title" className="font-serif text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-ink-primary">
                  Session Requested
                </h3>
                <p className="mt-3 text-ink-muted text-sm leading-relaxed max-w-sm mx-auto font-sans">
                  Thank you, <b>{formData.name || 'Candidate'}</b>. Your consultation profile has been registered. Coach Aditya will review your ratings and reach out via email.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-6 rounded-md bg-[#FCFDFF] text-[#000000] hover:bg-slate-200 active:scale-[0.99] transition-all font-sans text-sm font-semibold tracking-normal flex items-center justify-center cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-ink-primary"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="font-mono text-xs text-accent-amber block mb-1">
                    consultation.register
                  </span>
                  <h3 id="booking-modal-title" className="font-serif text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-ink-primary">
                    Book a Diagnostic Consultation
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1.5 font-sans leading-relaxed">
                    Provide your chess credentials so Coach Aditya can prepare an individualized assessment.
                  </p>
                </div>

                {status === 'error' && (
                  <div className="mb-4 p-3 rounded-md bg-surface-deep border border-accent-red/30 text-accent-red text-xs font-mono" role="alert">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-4 font-sans">
                  <div>
                    <label htmlFor="booking-name" className="block text-xs font-sans font-medium text-ink-primary mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="booking-name"
                      ref={firstInputRef}
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-md bg-surface-deep border border-border-subtle text-base sm:text-sm text-ink-primary focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary transition-[border-color] duration-150"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-email" className="block text-xs font-sans font-medium text-ink-primary mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-md bg-surface-deep border border-border-subtle text-base sm:text-sm text-ink-primary focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary transition-[border-color] duration-150"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="booking-rating" className="block text-xs font-sans font-medium text-ink-primary mb-1.5">
                        Rating Tier
                      </label>
                      <select
                        id="booking-rating"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-md bg-surface-deep border border-border-subtle text-base sm:text-sm text-ink-primary focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary transition-[border-color] duration-150"
                      >
                        <option value="1000-1400">Club (1000 to 1400)</option>
                        <option value="1400-1800">Intermediate (1400 to 1800)</option>
                        <option value="1800-2100">Tournament (1800 to 2100)</option>
                        <option value="2100-2400+">Candidate Master+ (2100 to 2400+)</option>
                        <option value="Under 1000">Foundational (&lt;1000)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="booking-goal" className="block text-xs font-sans font-medium text-ink-primary mb-1.5">
                        Primary Goal
                      </label>
                      <select
                        id="booking-goal"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-md bg-surface-deep border border-border-subtle text-base sm:text-sm text-ink-primary focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary transition-[border-color] duration-150"
                      >
                        <option value="Positional understanding">Positional Ideas</option>
                        <option value="Opening Repertoire">Opening Systems</option>
                        <option value="Calculation & Tactics">Tactical Intuition</option>
                        <option value="Endgame Technique">Endgame Precision</option>
                        <option value="Tournament Preparation">Tournament Prep</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="booking-message" className="block text-xs font-sans font-medium text-ink-primary mb-1.5">
                      Current Obstacles (Optional)
                    </label>
                    <textarea
                      id="booking-message"
                      rows={2}
                      placeholder="Positions or phases of the game that trouble you most..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-md bg-surface-deep border border-border-subtle text-base sm:text-sm text-ink-primary focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary transition-[border-color] duration-150 resize-none"
                    />
                  </div>

                  {/* Slide to Confirm */}
                  <div className="mt-5 pt-4 border-t border-border-subtle">
                    <SlideToConfirm
                      onConfirm={handleSubmit}
                      isLoading={status === 'submitting'}
                      isConfirmed={false}
                      text="Slide to request evaluation"
                      confirmedText="Evaluation Booked"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
