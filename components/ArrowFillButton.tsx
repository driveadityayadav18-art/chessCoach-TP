'use client';

import React from 'react';
import SpecularButton from './reactbits/SpecularButton';
import { playChessPieceThud } from './SoundToggle';

export interface ArrowFillButtonProps {
  children?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

export default function ArrowFillButton({
  children,
  text = 'Schedule evaluation',
  onClick,
  className = '',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: ArrowFillButtonProps) {
  const labelText = children || text;
  const computedAria =
    typeof ariaLabel === 'string'
      ? ariaLabel
      : typeof labelText === 'string'
        ? labelText
        : 'Action';

  const handleClick = () => {
    if (disabled) return;
    playChessPieceThud(0.8);
    onClick?.();
  };

  if (variant === 'primary') {
    return (
      <SpecularButton
        type={type}
        disabled={disabled}
        aria-label={computedAria}
        onClick={handleClick}
        size={size}
        radius={999}
        tint="#e2783e"
        tintOpacity={0.92}
        blur={0}
        textColor="#18120e"
        lineColor="#fff1e2"
        baseColor="#a85124"
        intensity={1}
        idleIntensity={0.35}
        shineSize={10}
        shineFade={34}
        thickness={1.2}
        glow={0.85}
        followMouse
        proximity={250}
        className={`${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      >
        {labelText}
      </SpecularButton>
    );
  }

  const sizeClass =
    size === 'sm' ? 'kiln-btn--sm' : size === 'lg' ? 'text-base px-7' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={computedAria}
      onClick={handleClick}
      className={`kiln-btn kiln-btn--ghost ${sizeClass} ${
        fullWidth ? 'w-full' : ''
      } ${className}`.trim()}
    >
      {labelText}
    </button>
  );
}

