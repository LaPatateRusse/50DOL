const ETAPES = [
  {
    numero: '01',
    titre: 'Vous passez commande',
    description:
      'Remplissez le formulaire en bas de page. Choisissez le service, décrivez votre problème en quelques mots. C\'est simple et rapide.',
    icon: '📋',
  },
  {
    numero: '02',
    titre: 'Je vous contacte',
    description:
      'Je vous réponds par email dans les 2h pour planifier une session. On se connecte à distance via un outil simple (TeamViewer ou AnyDesk).',
    icon: '📞',
  },
  {
    numero: '03',
    titre: 'Problème résolu',
    description:
      'J\'interviens sur votre ordinateur à distance. Vous regardez, vous apprenez, et votre problème est réglé. Paiement uniquement après satisfaction.',
    icon: '✅',
  },
]

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-24 bg-dark-800 relative overflow-hidden">
      {/* Dégradé de fond */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">
            Processus
          </span>
          <h2 className="section-title mt-3">
            Résoudre votre problème en 3 étapes
          </h2>
          <p className="section-subtitle mx-auto mt-4">
            Pas besoin de vous déplacer. Tout se fait depuis chez vous, en toute simplicité.
          </p>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Ligne de connexion — desktop */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-600/50 via-brand-400/50 to-brand-600/50" />

          {ETAPES.map((etape, index) => (
            <div key={index} className="relative text-center group">
              {/* Bulle numéro */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-brand-600/10 border border-brand-500/30 rounded-2xl flex flex-col items-center justify-center group-hover:bg-brand-600/20 transition-colors duration-300">
                  <span className="text-3xl mb-1">{etape.icon}</span>
                  <span className="text-brand-400 text-xs font-bold">Étape {etape.numero}</span>
                </div>
              </div>

              {/* Contenu */}
              <h3 className="text-xl font-bold text-white mb-3">{etape.titre}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{etape.description}</p>
            </div>
          ))}
        </div>

        {/* Bannière réassurance */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔒', text: 'Connexion sécurisée & contrôlée par vous' },
            { icon: '💳', text: 'Paiement après intervention réussie' },
            { icon: '🇫🇷', text: 'Technicien francophone & pédagogue' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white/70 text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
