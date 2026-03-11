export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900">
      {/* Fond avec grille et dégradé */}
      <div className="absolute inset-0">
        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Orb bleu central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />
        {/* Orb bleu droite */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600/20 border border-brand-500/30 rounded-full text-brand-300 text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          Technicien disponible · Réponse sous 2h
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-fade-in-up">
          Votre technicien{' '}
          <span className="text-gradient">informatique</span>
          <br />à distance
        </h1>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-fade-in-up">
          Installation, dépannage, configuration, formation. Des solutions rapides et claires,
          directement depuis votre canapé. À partir de <strong className="text-white">10€</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up">
          <a href="#commander" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
            Commander un service
            <span>→</span>
          </a>
          <a href="#services" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
            Voir les tarifs
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">200+</div>
            <div className="text-white/50 text-sm mt-1">Clients satisfaits</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-3xl font-bold text-white">2h</div>
            <div className="text-white/50 text-sm mt-1">Délai moyen</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-white/50 text-sm mt-1">Problèmes résolus</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
