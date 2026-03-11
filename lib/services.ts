// Liste des services proposés avec leurs prix
export const SERVICES = [
  {
    id: 'installation-logiciel',
    nom: 'Installation logiciel',
    description: 'Word, Office, Adobe, antivirus, navigateurs, etc.',
    prix: 10,
    icon: '💿',
  },
  {
    id: 'depannage-pc-mac',
    nom: 'Dépannage PC/Mac à distance',
    description: 'Résolution de pannes, erreurs système, lenteurs, virus.',
    prix: 20,
    icon: '🖥️',
  },
  {
    id: 'configuration-reseau',
    nom: 'Configuration réseau/Wi-Fi',
    description: 'Box internet, Wi-Fi, partage de connexion, imprimante réseau.',
    prix: 15,
    icon: '📡',
  },
  {
    id: 'nettoyage-optimisation',
    nom: 'Nettoyage & optimisation PC',
    description: 'Accélérer votre PC, libérer de l\'espace, supprimer les malwares.',
    prix: 15,
    icon: '⚡',
  },
  {
    id: 'aide-formation',
    nom: 'Aide & formation débutants',
    description: 'Prise en main Windows/Mac, Word, Excel, email, navigation web.',
    prix: 25,
    icon: '🎓',
    prixSuffix: '/h',
  },
] as const

export type ServiceId = typeof SERVICES[number]['id']

// Retourne le prix d'un service par son identifiant
export function getPrixService(serviceId: string): number {
  const service = SERVICES.find((s) => s.id === serviceId)
  return service?.prix ?? 0
}
