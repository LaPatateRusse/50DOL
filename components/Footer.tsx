export default function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@techassist.fr'

  return (
    <footer className="bg-dark-950 border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo + description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-sm">
                ⚡
              </div>
              <span className="font-bold text-lg text-white">TechAssist</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Technicien informatique freelance. Dépannage, installation et formation
              à distance pour les particuliers.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Services</h3>
            <ul className="space-y-2">
              {[
                'Installation logiciel — 10€',
                'Dépannage PC/Mac — 20€',
                'Configuration réseau — 15€',
                'Nettoyage & optimisation — 15€',
                'Formation débutants — 25€/h',
              ].map((s) => (
                <li key={s} className="text-white/40 text-sm">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Contact</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-white/40 hover:text-brand-400 text-sm transition-colors"
              >
                <span>✉️</span>
                <span>{email}</span>
              </a>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <span>⏰</span>
                <span>Lun–Sam · 9h–20h</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <span>⚡</span>
                <span>Réponse sous 2h garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de bas */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} TechAssist · Technicien informatique indépendant
          </p>
          <p className="text-white/20 text-xs">
            Fait avec ❤️ en France
          </p>
        </div>
      </div>
    </footer>
  )
}
