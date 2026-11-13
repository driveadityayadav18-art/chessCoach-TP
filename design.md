---
version: 1.0.0
name: chesscoach
system: resend-editorial
description: |
  Aditya Yadav — Master Chess Mentorship design authority.
  Derived from the Resend design system, combining pure obsidian canvas (#000000),
  warm amber/copper atmospheric micro-voltage (#FF801F), oversized high-contrast
  editorial serif headlines, and surgical technical precision for 8x8 analytical
  chessboards, candidate calculation trees, and 3D WebGL Staunton craftsmanship.

colors:
  # Canvas & Obsidian Surfaces
  canvas: "#000000"
  surface-card: "#0A0A0C"
  surface-elevated: "#101012"
  surface-deep: "#06060A"
  surface-light: "#FCFDFF"

  # High-Contrast Typography & Ink
  primary: "#FCFDFF"
  primary-on: "#000000"
  ink: "#FCFDFF"
  body: "rgba(252, 253, 255, 0.86)"
  charcoal: "rgba(252, 253, 255, 0.70)"
  mute: "#A1A4A5"
  ash: "#888E90"
  stone: "#464A4D"

  # Translucent Hairline Borders & Dividers (Zero Drop Shadows)
  hairline: "rgba(255, 255, 255, 0.06)"
  hairline-strong: "rgba(255, 255, 255, 0.14)"
  divider-soft: "rgba(255, 255, 255, 0.04)"

  # Warm Amber / Copper Atmospheric Micro-Voltage
  accent-amber: "#FF801F"
  accent-amber-glow: "rgba(255, 128, 31, 0.18)"
  accent-amber-subtle: "rgba(255, 128, 31, 0.08)"
  accent-amber-hover: "#E06D16"

  # Telemetry & Status Accents
  accent-green: "#11FF99"
  accent-green-glow: "rgba(17, 255, 153, 0.18)"
  accent-blue: "#3B9EFF"
  accent-red: "#FF2047"

typography:
  display-xxl:
    fontFamily: "var(--font-serif), Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(48px, 6vw, 84px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  display-xl:
    fontFamily: "var(--font-serif), Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(36px, 4.5vw, 64px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  display-lg:
    fontFamily: "var(--font-serif), Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(28px, 3.2vw, 44px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading-md:
    fontFamily: "var(--font-sans), Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: "var(--font-sans), Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "var(--font-sans), Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "var(--font-sans), Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  code-md:
    fontFamily: "var(--font-mono), Geist Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  code-sm:
    fontFamily: "var(--font-mono), Geist Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5

rounded:
  none: "0px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-on}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.md}"
    padding: "8px 18px"
  button-ghost:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  code-window:
    backgroundColor: "{colors.surface-deep}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline}"
  dossier-window:
    backgroundColor: "{colors.surface-card}"
    headerBorder: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"

rules:
  - "Canvas is pure #000000 on every screen. No light background bands."
  - "Surface elevation is expressed through translucent hairlines (6% subtle, 14% strong) and tone steps (#06060A to #101012), never drop shadows."
  - "Hero headline max 7 words; subhead max 12 words."
  - "Interactive elements require instant :focus-visible outlines."
  - "Never transition: all. Animate only transform and opacity."
  - "No purple gradients, no emojis as icons, no invented badges."
---

# Aditya Yadav — Master Chess Mentorship Design System

## Architectural Overview
This system locks the visual identity of Coach Aditya's grandmaster chess mentorship into an authoritative, nocturnal editorial universe. By marrying Resend's uncompromising dark-canvas restraint with classical chess craftsmanship, the digital experience treats competitive chess not as an arcade game, but as high art, scientific rigor, and profound positional pedagogy.
