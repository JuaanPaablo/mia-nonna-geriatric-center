import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({ 
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mia Nonna - Centro Geriátrico | Cuidado Profesional para Personas Mayores',
    template: '%s | Mia Nonna Centro Geriátrico',
  },
  description: 'Centro geriátrico Mia Nonna ofrece cuidado profesional 24/7 para personas mayores. Servicios de residencia, centro de día y respiro familiar con personal especializado en Madrid.',
  keywords: [
    'centro geriátrico',
    'residencia mayores',
    'centro día',
    'cuidado personas mayores',
    'geriatría Madrid',
    'residencia ancianos',
    'cuidados especializados',
    'atención geriátrica',
    'fisioterapia mayores',
    'terapia ocupacional'
  ],
  authors: [{ name: 'Mia Nonna Centro Geriátrico' }],
  creator: 'Mia Nonna',
  publisher: 'Mia Nonna Centro Geriátrico',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mianonna.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://mianonna.com',
    title: 'Mia Nonna - Centro Geriátrico de Confianza en Madrid',
    description: 'Cuidado profesional y cariñoso para personas mayores. Atención médica 24/7, instalaciones modernas y personal especializado. Tu familia merece el mejor cuidado.',
    siteName: 'Mia Nonna Centro Geriátrico',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mia Nonna Centro Geriátrico - Cuidado profesional para personas mayores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mia Nonna - Centro Geriátrico de Confianza',
    description: 'Cuidado profesional y cariñoso para personas mayores en Madrid. Atención 24/7 con personal especializado.',
    images: ['/og-image.jpg'],
    creator: '@mianonna',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'healthcare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#009de6" />
        <meta name="msapplication-TileColor" content="#009de6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Structured Data for Healthcare Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              "name": "Mia Nonna Centro Geriátrico",
              "description": "Centro geriátrico especializado en el cuidado integral de personas mayores con servicios médicos 24/7.",
              "url": "https://mianonna.com",
              "logo": "https://mianonna.com/logo.png",
              "image": "https://mianonna.com/og-image.jpg",
              "telephone": "+34912345678",
              "email": "info@mianonna.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Calle de la Salud, 123",
                "addressLocality": "Madrid",
                "addressRegion": "Madrid",
                "postalCode": "28001",
                "addressCountry": "ES"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.4168",
                "longitude": "-3.7038"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                  ],
                  "opens": "00:00",
                  "closes": "23:59"
                }
              ],
              "medicalSpecialty": [
                "Geriatrics",
                "Physiotherapy", 
                "Occupational Therapy",
                "Nutrition"
              ],
              "hasCredential": [
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "ISO 9001 Quality Management"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "150",
                "bestRating": "5",
                "worstRating": "1"
              },
              "sameAs": [
                "https://facebook.com/mianonna",
                "https://instagram.com/mianonna",
                "https://linkedin.com/company/mianonna"
              ]
            })
          }}
        />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          merriweather.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
