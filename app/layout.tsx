import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TechAssist — Dépannage & Services Informatiques',
  description:
    'Technicien informatique freelance : installation logiciels, dépannage PC/Mac, configuration réseau, optimisation. Rapide, efficace, à distance.',
  keywords: 'dépannage informatique, installation logiciel, aide PC Mac, technicien freelance, configuration réseau',
  openGraph: {
    title: 'TechAssist — Services Informatiques à Distance',
    description: 'Dépannage, installation, configuration. Des prix clairs, une aide rapide.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  )
}
