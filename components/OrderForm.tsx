'use client'

import { useState } from 'react'
import { SERVICES } from '@/lib/services'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function OrderForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      nom: formData.get('nom') as string,
      email: formData.get('email') as string,
      service: formData.get('service') as string,
      description: formData.get('description') as string,
    }

    try {
      const res = await fetch('/api/commande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Erreur lors de l\'envoi')
      }

      setFormState('success')
      // Reset le formulaire
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setFormState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <section id="commander" className="py-24 bg-dark-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">
            Commande
          </span>
          <h2 className="section-title mt-3">Démarrer maintenant</h2>
          <p className="section-subtitle mx-auto mt-4">
            Remplissez le formulaire ci-dessous. Je vous réponds sous 2h pour planifier l&apos;intervention.
          </p>
        </div>

        {/* Formulaire */}
        {formState === 'success' ? (
          // Message de succès
          <div className="card-glass p-10 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Commande reçue !</h3>
            <p className="text-white/60 mb-6">
              Je vous contacterai à l&apos;adresse email fournie dans les 2 prochaines heures
              pour planifier notre session.
            </p>
            <button
              onClick={() => setFormState('idle')}
              className="btn-secondary text-sm"
            >
              Faire une autre commande
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-glass p-6 sm:p-8 space-y-5">
            {/* Nom */}
            <div>
              <label htmlFor="nom" className="form-label">Votre nom *</label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                placeholder="Jean Dupont"
                className="form-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Votre email *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jean.dupont@email.fr"
                className="form-input"
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service" className="form-label">Service souhaité *</label>
              <select
                id="service"
                name="service"
                required
                className="form-input bg-dark-800 appearance-none cursor-pointer"
              >
                <option value="" className="bg-dark-800">— Choisissez un service —</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-dark-800">
                    {s.nom} — {s.prix}€{'prixSuffix' in s ? s.prixSuffix : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">
                Décrivez votre problème *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Ex : Mon PC est très lent au démarrage depuis 2 semaines, il a Windows 10..."
                className="form-input resize-none"
              />
              <p className="text-white/30 text-xs mt-1">
                Plus vous êtes précis, plus je peux intervenir efficacement.
              </p>
            </div>

            {/* Message d'erreur */}
            {formState === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <span>⚠️</span>
                <span>{errorMessage || 'Une erreur est survenue. Réessayez.'}</span>
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {formState === 'loading' ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>Envoyer ma demande →</>
              )}
            </button>

            {/* Réassurance */}
            <p className="text-center text-white/30 text-xs">
              🔒 Vos données sont sécurisées et ne sont jamais partagées.
              <br />Paiement uniquement après intervention réussie.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
