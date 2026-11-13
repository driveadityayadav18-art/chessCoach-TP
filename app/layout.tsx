import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const cormorantFallback = Cormorant_Garamond({
  variable: '--font-serif-fallback',
  subsets: ['latin'],
  weight: ['500', '600'],
  display: 'swap',
});

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const SITE_TITLE = 'Coach Aditya Yadav: Grandmaster Chess Pedagogy and Master Mentorship';
const SITE_DESCRIPTION =
  'One-on-one chess mentorship for tournament competitors rated 1400 to 2400+ Elo, focused on candidate calculation and structural mastery.';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'Aditya Yadav Chess Mentorship',
    images: [
      {
        url: '/images/hero-chess-studio.jpg',
        width: 1200,
        height: 900,
        alt: 'Hand-turned wooden Staunton chess pieces under warm studio lighting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/images/hero-chess-studio.jpg'],
  },
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Aditya Yadav Chess Mentorship',
  description: SITE_DESCRIPTION,
  provider: {
    '@type': 'Person',
    name: 'Aditya Yadav',
    jobTitle: 'Grandmaster Chess Coach',
  },
  areaServed: 'Worldwide',
  serviceType: 'One-on-one tournament chess coaching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantFallback.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=boska@500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('kiln-preloader-seen')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.preloaderDone='1';}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </head>
      <body className="bg-paper text-ink font-sans antialiased">
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
