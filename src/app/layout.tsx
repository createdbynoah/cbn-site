import type { Metadata } from 'next';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MouseGradient from '@/components/MouseGradient';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s | Noah Rodgers',
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Noah Rodgers | Product Engineer',
    description: SITE_DESCRIPTION,
    images: [{ url: '/assets/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noah Rodgers | Product Engineer',
    description: SITE_DESCRIPTION,
    images: ['/assets/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/assets/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/assets/favicon.ico',
    apple: { url: '/assets/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/assets/site.webmanifest',
  other: {
    'apple-mobile-web-app-title': 'Noah Rodgers',
    'theme-color': '#0b0a08',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="ready">
        <MouseGradient />
        <div className="wrap">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
