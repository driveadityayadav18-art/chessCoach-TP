import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coach Aditya Yadav — Grandmaster Chess Pedagogy & Master Mentorship',
  description: 'Elite 1-on-1 chess mentorship engineered for ambitious tournament competitors (1400–2400+ Elo). Transform calculation, pawn ecology, and positional clarity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-canvas text-ink-primary font-sans antialiased selection:bg-ink-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
