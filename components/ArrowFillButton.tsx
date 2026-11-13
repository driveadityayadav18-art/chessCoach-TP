'use client';

import React from 'react';
import { playChessPieceThud } from './SoundToggle';

export interface ArrowFillButtonProps {
  children?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export default function ArrowFillButton({
  children,
  text = 'Book a Free Session',
  onClick,
  className = '',
  size = 'md',
  fullWidth = false,
  type = 'button',
  'aria-label': ariaLabel,
}: ArrowFillButtonProps) {
  const labelText = children || text;

  const sizeClasses = {
    sm: 'h-[38px] text-xs pl-4 pr-[42px] [--icon-circle:28px] [--icon-right:5px]',
    md: 'h-[46px] text-xs sm:text-[13px] pl-6 pr-[52px] [--icon-circle:34px] [--icon-right:6px]',
    lg: 'h-[52px] text-sm pl-7 pr-[58px] [--icon-circle:38px] [--icon-right:7px]',
  }[size];

  return (
    <button
      type={type}
      aria-label={typeof ariaLabel === 'string' ? ariaLabel : typeof labelText === 'string' ? labelText : 'Action'}
      onClick={() => {
        playChessPieceThud(1.0);
        onClick?.();
      }}
      onMouseEnter={() => playChessPieceThud(0.6)}
      className={`afb-btn group relative inline-flex items-center justify-center font-sans font-semibold tracking-wide rounded-full overflow-hidden select-none cursor-pointer transition-shadow duration-300 ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${sizeClasses} ${className}`}
    >
      {/* Base Label (White text on Terracotta background) */}
      <span className="afb-label relative z-10 whitespace-nowrap leading-none transition-transform duration-300">
        {labelText}
      </span>

      {/* Expanding Background Circle */}
      <span aria-hidden="true" className="afb-circle pointer-events-none absolute z-20 rounded-full" />

      {/* Masked Label (reveals Terracotta text as White circle expands) */}
      <span
        aria-hidden="true"
        className={`afb-mask pointer-events-none absolute inset-0 z-20 flex items-center leading-none ${sizeClasses}`}
      >
        <span className="relative z-10 whitespace-nowrap leading-none">
          {labelText}
        </span>
      </span>

      {/* Circular Arrow Badge with Kinetic Swapping Arrows */}
      <span aria-hidden="true" className="afb-icon pointer-events-none absolute z-30 rounded-full flex items-center justify-center">
        {/* Exit Arrow: Disappears to Top-Right */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="afb-arrow afb-arrow--exit"
        >
          <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" />
        </svg>

        {/* Enter Arrow: Swoops in from Bottom-Left */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="afb-arrow afb-arrow--enter"
        >
          <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" />
        </svg>
      </span>
    </button>
  );
}
