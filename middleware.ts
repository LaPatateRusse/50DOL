import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth'

// Middleware — Protège les routes /admin/* (sauf /admin/login et l'API auth)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Routes exclues de la protection
  const publicAdminPaths = ['/admin/login', '/api/admin/login', '/api/admin/logout']
  if (publicAdminPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Pour les routes /admin/* et /api/* protégées, vérifier le cookie
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/commandes') || pathname.startsWith('/api/commande') || pathname.startsWith('/api/envoyer-email')) {
    const sessionCookie = req.cookies.get(COOKIE_NAME)

    // Si pas de cookie, rediriger vers login
    if (!sessionCookie?.value) {
      // Pour les routes API, retourner 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
      }
      // Pour les pages, rediriger vers login
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/commandes/:path*',
    '/api/commande/:path*',
    '/api/envoyer-email',
  ],
}
