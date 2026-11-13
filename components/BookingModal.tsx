'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { playChessPieceThud } from './SoundToggle';
import { SlideToConfirm } from './kokonutui/SlideToConfirm';
import ArrowFillButton from './ArrowFillButton';

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

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

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
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
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

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    if (!trimmedName) {
      setStatus('error');
      setErrorMessage('Please enter your full name.');
      firstInputRef.current?.focus();
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    playChessPieceThud(0.8);

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: trimmedName,
          email: trimmedEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit the consultation request.');
      }

      setStatus('success');
      playChessPieceThud(1.3);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'The submission failed. Check your fields and try again.'
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-paper/95"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg p-7 sm:p-8 bg-paper-2 text-ink rounded-well border border-rule-strong overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                playChessPieceThud(0.7);
                onClose();
              }}
              className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-paper-3 transition-colors cursor-pointer border border-rule focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="Close consultation dialog"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-paper text-accent-green rounded-full flex items-center justify-center border border-rule">
                  <Check className="w-5 h-5" aria-hidden="true" />
                </div>
                <h2
                  id="booking-modal-title"
                  className="font-serif text-3xl text-ink"
                >
                  Session requested
                </h2>
                <p className="mt-3 text-muted text-base leading-relaxed max-w-sm mx-auto font-sans">
                  Thank you, <strong className="text-ink font-medium">{formData.name || 'Candidate'}</strong>. Your profile is registered and Coach Aditya will reply by email.
                </p>
                <div className="mt-8">
                  <ArrowFillButton
                    size="md"
                    variant="primary"
                    fullWidth
                    onClick={onClose}
                    text="Close window"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 pr-10">
                  <h2
                    id="booking-modal-title"
                    className="font-serif text-3xl text-ink"
                  >
                    Book a diagnostic session
                  </h2>
                  <p className="text-sm text-muted mt-2 font-sans leading-relaxed">
                    Share your current rating and primary focus so Coach Aditya can review your recent tournament play.
                  </p>
                </div>

                <div className="min-h-[1lh] mb-3" aria-live="polite">
                  {status === 'error' && (
                    <div
                      className="p-3 rounded-md bg-paper border border-accent-red text-ink text-sm font-sans"
                      role="alert"
                    >
                      {errorMessage}
                    </div>
                  )}
                </div>

                <div className="space-y-4 font-sans">
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-sm font-sans font-medium text-ink-2 mb-1.5"
                    >
                      Full name
                    </label>
                    <input
                      id="booking-name"
                      ref={firstInputRef}
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => {
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage('');
                        }
                        setFormData({ ...formData, name: e.target.value });
                      }}
                      className="w-full min-h-[48px] px-4 rounded-well bg-paper border border-rule text-base text-ink focus:outline-2 focus:outline-focus focus:-outline-offset-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-sm font-sans font-medium text-ink-2 mb-1.5"
                    >
                      Email address
                    </label>
                    <input
                      id="booking-email"
                      ref={emailInputRef}
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage('');
                        }
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      className="w-full min-h-[48px] px-4 rounded-well bg-paper border border-rule text-base text-ink focus:outline-2 focus:outline-focus focus:-outline-offset-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="booking-rating"
                        className="block text-sm font-sans font-medium text-ink-2 mb-1.5"
                      >
                        Rating tier
                      </label>
                      <select
                        id="booking-rating"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        className="w-full min-h-[48px] px-3.5 rounded-well bg-paper border border-rule text-base text-ink focus:outline-2 focus:outline-focus focus:-outline-offset-2"
                      >
                        <option value="1000-1400">Club (1000 to 1400)</option>
                        <option value="1400-1800">Intermediate (1400 to 1800)</option>
                        <option value="1800-2100">Tournament (1800 to 2100)</option>
                        <option value="2100-2400+">Master tier (2100 to 2400+)</option>
                        <option value="Under 1000">Foundational (under 1000)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="booking-goal"
                        className="block text-sm font-sans font-medium text-ink-2 mb-1.5"
                      >
                        Primary focus
                      </label>
                      <select
                        id="booking-goal"
                        value={formData.goal}
                        onChange={(e) =>
                          setFormData({ ...formData, goal: e.target.value })
                        }
                        className="w-full min-h-[48px] px-3.5 rounded-well bg-paper border border-rule text-base text-ink focus:outline-2 focus:outline-focus focus:-outline-offset-2"
                      >
                        <option value="Positional understanding">Positional play</option>
                        <option value="Opening Repertoire">Opening systems</option>
                        <option value="Calculation & Tactics">Calculation precision</option>
                        <option value="Endgame Technique">Endgame technique</option>
                        <option value="Tournament Preparation">Tournament preparation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-message"
                      className="block text-sm font-sans font-medium text-ink-2 mb-1.5"
                    >
                      Recent tournament notes (optional)
                    </label>
                    <textarea
                      id="booking-message"
                      rows={2}
                      placeholder="Positions or phases where your games break down…"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-well bg-paper border border-rule text-base text-ink focus:outline-2 focus:outline-focus focus:-outline-offset-2 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <SlideToConfirm
                      onConfirm={handleSubmit}
                      isLoading={status === 'submitting'}
                      isConfirmed={false}
                      text="Slide to request evaluation"
                      confirmedText="Evaluation requested"
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
