import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

// GET /api/commandes — Lister toutes les commandes (admin seulement)
export async function GET() {
  // Vérification auth admin
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const commandes = await prisma.commande.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ commandes })
  } catch (error) {
    console.error('[GET /api/commandes]', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
