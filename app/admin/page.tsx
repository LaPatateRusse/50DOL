import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Vérification de l'authentification côté serveur
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    redirect('/admin/login')
  }

  // Récupération de toutes les commandes
  const commandes = await prisma.commande.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Calcul des statistiques
  const stats = {
    total: commandes.length,
    enAttente: commandes.filter((c) => c.statut === 'EN_ATTENTE').length,
    enCours: commandes.filter((c) => c.statut === 'EN_COURS').length,
    termines: commandes.filter((c) => c.statut === 'TERMINE').length,
    payes: commandes.filter((c) => c.statut === 'PAYE').length,
    caTotalEstime: commandes
      .filter((c) => c.statut === 'PAYE')
      .reduce((acc, c) => acc + c.prixService, 0),
    caPotentiel: commandes.reduce((acc, c) => acc + c.prixService, 0),
  }

  return <AdminDashboard commandes={commandes} stats={stats} />
}
