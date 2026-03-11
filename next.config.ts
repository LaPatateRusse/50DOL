import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Optimisation des images
  images: {
    remotePatterns: [],
  },
  // Variables d'environnement exposées au client
  env: {
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@techservices.fr',
  },
}

export default nextConfig
