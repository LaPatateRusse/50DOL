'use client'

import { useState } from 'react'
import { type Commande } from '@prisma/client'

export default function EmailModal({
  commande,
  onClose,
}: {
  commande: Commande
  onClose: () => void
}) {
  const [sujet, setSujet] = useState(`Votre demande TechAssist — ${commande.service}`)
  const [message, setMessage] = useState(
    `Bonjour ${commande.nom},\n\nMerci pour votre demande concernant : ${commande.service}.\n\nJ'ai bien pris en compte votre message :\n"${commande.description}"\n\nJe vous propose de planifier notre session ensemble. Pouvez-vous me donner vos disponibilités ?\n\nCordialement,\nVotre technicien TechAssist`
  )
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/envoyer-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commandeId: commande.id,
          destinataire: commande.email,
          nomClient: commande.nom,
          sujet,
          message,
        }),
      })

      if (res.ok) {
        setSent(true)
        setTimeout(onClose, 2000)
      } else {
        const err = await res.json()
        setError(err.message || 'Erreur lors de l\'envoi')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setSending(false)
    }
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg card-admin animate-fade-in-up overflow-hidden">
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="font-semibold text-white">Envoyer un email</h2>
            <p className="text-white/40 text-xs mt-0.5">À : {commande.nom} ({commande.email})</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Corps modal */}
        <div className="p-6 space-y-4">
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-white font-semibold">Email envoyé !</p>
              <p className="text-white/40 text-sm mt-1">La fenêtre se ferme automatiquement...</p>
            </div>
          ) : (
            <>
              {/* Sujet */}
              <div>
                <label className="form-label">Sujet</label>
                <input
                  type="text"
                  value={sujet}
                  onChange={(e) => setSujet(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Message */}
              <div>
                <label className="form-label">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="form-input resize-none font-mono text-sm"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {sending ? 'Envoi...' : '✉️ Envoyer'}
                </button>
                <button onClick={onClose} className="btn-secondary py-3 px-5">
                  Annuler
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
