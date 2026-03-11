'use client'

import { useState } from 'react'
import { type Commande, StatutCommande } from '@prisma/client'
import EmailModal from './EmailModal'

type Stats = {
  total: number
  enAttente: number
  enCours: number
  termines: number
  payes: number
  caTotalEstime: number
  caPotentiel: number
}

const STATUT_CONFIG: Record<StatutCommande, { label: string; color: string; bg: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  EN_COURS:   { label: 'En cours',   color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30' },
  TERMINE:    { label: 'Terminé',    color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30' },
  PAYE:       { label: 'Payé',       color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
}

export default function AdminDashboard({
  commandes: initialCommandes,
  stats,
}: {
  commandes: Commande[]
  stats: Stats
}) {
  const [commandes, setCommandes] = useState(initialCommandes)
  const [emailModal, setEmailModal] = useState<Commande | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  const [filterStatut, setFilterStatut] = useState<StatutCommande | 'TOUS'>('TOUS')

  // Changer le statut d'une commande
  async function changerStatut(id: number, statut: StatutCommande) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/commande/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut }),
      })
      if (res.ok) {
        setCommandes((prev) =>
          prev.map((c) => (c.id === id ? { ...c, statut } : c))
        )
      }
    } finally {
      setUpdating(null)
    }
  }

  // Déconnexion
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  // Filtrage des commandes
  const commandesFiltrees =
    filterStatut === 'TOUS'
      ? commandes
      : commandes.filter((c) => c.statut === filterStatut)

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-dark-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-sm">⚡</div>
            <span className="font-bold text-white">TechAssist</span>
            <span className="text-white/30 text-sm ml-2">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-white/40 hover:text-white text-sm transition-colors">
              Voir le site →
            </a>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-white/40 text-sm mt-1">
            Gérez vos commandes et suivez votre activité
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Commandes totales" value={stats.total} icon="📋" color="blue" />
          <StatCard label="En attente" value={stats.enAttente} icon="⏳" color="yellow" />
          <StatCard label="CA encaissé" value={`${stats.caTotalEstime}€`} icon="💰" color="green" />
          <StatCard label="CA potentiel" value={`${stats.caPotentiel}€`} icon="📈" color="purple" />
        </div>

        {/* Barre de progression CA */}
        {stats.caPotentiel > 0 && (
          <div className="card-admin p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Taux de conversion (Payé / Total)</span>
              <span className="text-white font-semibold text-sm">
                {Math.round((stats.caTotalEstime / stats.caPotentiel) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${(stats.caTotalEstime / stats.caPotentiel) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>{stats.caTotalEstime}€ encaissés</span>
              <span>{stats.caPotentiel}€ potentiels</span>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          {(['TOUS', 'EN_ATTENTE', 'EN_COURS', 'TERMINE', 'PAYE'] as const).map((statut) => (
            <button
              key={statut}
              onClick={() => setFilterStatut(statut)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterStatut === statut
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {statut === 'TOUS' ? 'Toutes' : STATUT_CONFIG[statut as StatutCommande].label}
              {statut !== 'TOUS' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({commandes.filter((c) => c.statut === statut).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table des commandes */}
        {commandesFiltrees.length === 0 ? (
          <div className="card-admin p-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white/40">Aucune commande {filterStatut !== 'TOUS' ? 'avec ce statut' : ''}</p>
          </div>
        ) : (
          <div className="card-admin overflow-hidden">
            {/* Version desktop : tableau */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Client</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Service</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Message</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Tarif</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Statut</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {commandesFiltrees.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-white text-sm">{cmd.nom}</div>
                        <div className="text-white/40 text-xs mt-0.5">{cmd.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-white/70 text-sm">{cmd.service}</span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-white/50 text-xs line-clamp-2">{cmd.description}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-white font-semibold text-sm">{cmd.prixService}€</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-white/40 text-xs">
                          {new Date(cmd.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={cmd.statut}
                          onChange={(e) => changerStatut(cmd.id, e.target.value as StatutCommande)}
                          disabled={updating === cmd.id}
                          className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer bg-transparent disabled:opacity-50 ${
                            STATUT_CONFIG[cmd.statut].bg
                          } ${STATUT_CONFIG[cmd.statut].color}`}
                        >
                          {Object.entries(STATUT_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val} className="bg-dark-800 text-white">
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setEmailModal(cmd)}
                          className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
                        >
                          ✉️ Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Version mobile : cartes */}
            <div className="lg:hidden divide-y divide-white/5">
              {commandesFiltrees.map((cmd) => (
                <div key={cmd.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white text-sm">{cmd.nom}</div>
                      <div className="text-white/40 text-xs">{cmd.email}</div>
                    </div>
                    <span className="text-white font-bold">{cmd.prixService}€</span>
                  </div>
                  <div className="text-white/60 text-sm font-medium">{cmd.service}</div>
                  <p className="text-white/40 text-xs">{cmd.description}</p>
                  <div className="flex items-center justify-between">
                    <select
                      value={cmd.statut}
                      onChange={(e) => changerStatut(cmd.id, e.target.value as StatutCommande)}
                      disabled={updating === cmd.id}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border cursor-pointer bg-transparent ${
                        STATUT_CONFIG[cmd.statut].bg
                      } ${STATUT_CONFIG[cmd.statut].color}`}
                    >
                      {Object.entries(STATUT_CONFIG).map(([val, cfg]) => (
                        <option key={val} value={val} className="bg-dark-800 text-white">
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setEmailModal(cmd)}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                    >
                      ✉️ Envoyer email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal email */}
      {emailModal && (
        <EmailModal
          commande={emailModal}
          onClose={() => setEmailModal(null)}
        />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string | number
  icon: string
  color: 'blue' | 'yellow' | 'green' | 'purple'
}) {
  const colors = {
    blue:   'bg-blue-500/10 border-blue-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    green:  'bg-green-500/10 border-green-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
  }
  return (
    <div className={`card-admin p-4 border ${colors[color]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-white/40 text-xs mt-1">{label}</div>
    </div>
  )
}
