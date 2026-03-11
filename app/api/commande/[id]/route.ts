import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { StatutCommande } from '@prisma/client'

// PATCH /api/commande/:id — Mettre à jour le statut d'une commande (admin seulement)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Vérification auth admin
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = await params
    const commandeId = parseInt(id, 10)
    if (isNaN(commandeId)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 })
    }

    const body = await req.json()
    const { statut } = body

    // Validation du statut
    const statutsValides: StatutCommande[] = ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'PAYE']
    if (!statutsValides.includes(statut)) {
      return NextResponse.json({ message: 'Statut invalide' }, { status: 400 })
    }

    // Mise à jour en base
    const commande = await prisma.commande.update({
      where: { id: commandeId },
      data: { statut },
    })

    return NextResponse.json({ success: true, commande })
  } catch (error) {
    console.error('[PATCH /api/commande/:id]', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
