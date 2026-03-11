import { NextRequest, NextResponse } from 'next/server'
import { generateSessionToken, COOKIE_NAME } from '@/lib/auth'

// POST /api/admin/login — Authentification admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD non configuré')
      return NextResponse.json(
        { message: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }

    // Vérification du mot de passe
    if (password !== adminPassword) {
      // Délai artificiel pour éviter le brute-force
      await new Promise((resolve) => setTimeout(resolve, 500))
      return NextResponse.json(
        { message: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Génération et stockage du token de session
    const sessionToken = generateSessionToken(adminPassword)

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[POST /api/admin/login]', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
