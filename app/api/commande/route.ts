import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getPrixService } from '@/lib/services'

// POST /api/commande — Créer une nouvelle commande depuis le formulaire public
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nom, email, service, description } = body

    // Validation basique
    if (!nom || !email || !service || !description) {
      return NextResponse.json(
        { message: 'Tous les champs sont obligatoires' },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // Récupération du prix du service
    const prixService = getPrixService(service)
    if (!prixService) {
      return NextResponse.json(
        { message: 'Service invalide' },
        { status: 400 }
      )
    }

    // Création en base de données
    const commande = await prisma.commande.create({
      data: {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        service,
        prixService,
        description: description.trim(),
        statut: 'EN_ATTENTE',
      },
    })

    return NextResponse.json(
      { success: true, id: commande.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/commande]', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
