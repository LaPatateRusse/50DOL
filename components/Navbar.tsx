'use client'

import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/90 backdrop-blur-md border-b border-white/10 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-sm font-bold">
              ⚡
            </div>
            <span className="font-bold text-lg text-white">TechAssist</span>
          </div>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              Services
            </a>
            <a href="#comment-ca-marche" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              Comment ça marche
            </a>
            <a href="#avis" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              Avis clients
            </a>
          </div>

          {/* CTA */}
          <a href="#commander" className="btn-primary text-sm py-2 px-4">
            Commander →
          </a>
        </div>
      </div>
    </nav>
  )
}
