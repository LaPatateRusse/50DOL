import { SERVICES } from '@/lib/services'

export default function Services() {
  return (
    <section id="services" className="py-24 bg-dark-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">
            Nos prestations
          </span>
          <h2 className="section-title mt-3">Des services clairs,<br />des tarifs transparents</h2>
          <p className="section-subtitle mx-auto mt-4">
            Plus besoin d&apos;attendre des heures le SAV. Je règle votre problème rapidement,
            directement depuis chez vous.
          </p>
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="card-glass p-6 hover:border-brand-500/30 hover:bg-white/[0.07] transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Icône */}
              <div className="w-12 h-12 bg-brand-600/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-brand-600/30 transition-colors">
                {service.icon}
              </div>

              {/* Contenu */}
              <h3 className="text-lg font-semibold text-white mb-2">{service.nom}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{service.description}</p>

              {/* Prix */}
              <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/10">
                <div>
                  <span className="text-3xl font-black text-white">{service.prix}€</span>
                  {'prixSuffix' in service && (
                    <span className="text-white/50 text-sm ml-1">{service.prixSuffix}</span>
                  )}
                </div>
                <a
                  href="#commander"
                  className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  Commander
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Note bas */}
        <p className="text-center text-white/40 text-sm mt-10">
          💬 Pas sûr du service dont vous avez besoin ?{' '}
          <a href="#commander" className="text-brand-400 hover:underline">
            Décrivez votre problème
          </a>{' '}
          et je vous oriente.
        </p>
      </div>
    </section>
  )
}
