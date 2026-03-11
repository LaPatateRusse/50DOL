const AVIS = [
  {
    prenom: 'Marie-Claire',
    ville: 'Lyon',
    service: 'Dépannage PC',
    note: 5,
    commentaire:
      'Mon ordinateur ramait depuis des mois. En 30 minutes, tout était réglé ! Très patient, il m\'a tout expliqué. Je recommande vivement.',
    date: 'Il y a 3 jours',
  },
  {
    prenom: 'Bernard',
    ville: 'Nantes',
    service: 'Installation Office',
    note: 5,
    commentaire:
      'J\'avais perdu ma licence Office après le remplacement de mon disque dur. Il a tout réinstallé rapidement. Excellent service, prix très correct.',
    date: 'Il y a 1 semaine',
  },
  {
    prenom: 'Isabelle',
    ville: 'Bordeaux',
    service: 'Configuration Wi-Fi',
    note: 5,
    commentaire:
      'Problème de Wi-Fi qui durait depuis ma box neuve. Résolu en moins d\'une heure ! Très professionnel et disponible. Merci !',
    date: 'Il y a 2 semaines',
  },
  {
    prenom: 'Michel',
    ville: 'Toulouse',
    service: 'Formation débutants',
    note: 5,
    commentaire:
      'Excellent formateur ! Il s\'adapte vraiment à mon niveau. J\'ai enfin compris comment utiliser Excel correctement. Super pédagogue.',
    date: 'Il y a 3 semaines',
  },
  {
    prenom: 'Sylvie',
    ville: 'Strasbourg',
    service: 'Nettoyage PC',
    note: 5,
    commentaire:
      'Mon PC qui mettait 10 minutes à démarrer démarre maintenant en 45 secondes. Travail impeccable, je suis bluffée !',
    date: 'Il y a 1 mois',
  },
  {
    prenom: 'Jean-Pierre',
    ville: 'Marseille',
    service: 'Dépannage Mac',
    note: 5,
    commentaire:
      'Très à l\'écoute, compétent, et honnête. Il n\'essaie pas de vous vendre des choses inutiles. Vraiment satisfait de la prestation.',
    date: 'Il y a 1 mois',
  },
]

function Etoiles({ note }: { note: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < note ? 'text-yellow-400' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section id="avis" className="py-24 bg-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">
            Témoignages
          </span>
          <h2 className="section-title mt-3">
            Ce que disent mes clients
          </h2>
          <p className="section-subtitle mx-auto mt-4">
            Plus de 200 clients accompagnés avec un taux de satisfaction de 98%.
          </p>

          {/* Note globale */}
          <div className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
            <Etoiles note={5} />
            <span className="text-white font-bold">5.0</span>
            <span className="text-white/50 text-sm">· 200+ avis vérifiés</span>
          </div>
        </div>

        {/* Grille d'avis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVIS.map((avis, index) => (
            <div
              key={index}
              className="card-glass p-6 hover:border-white/20 transition-all duration-300 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar généré */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                    {avis.prenom[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{avis.prenom}</div>
                    <div className="text-white/40 text-xs">{avis.ville}</div>
                  </div>
                </div>
                <Etoiles note={avis.note} />
              </div>

              {/* Commentaire */}
              <p className="text-white/60 text-sm leading-relaxed flex-1">
                &ldquo;{avis.commentaire}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-brand-400 font-medium">{avis.service}</span>
                <span className="text-xs text-white/30">{avis.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
