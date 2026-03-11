import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'

// Génère un token de session à partir du mot de passe admin
export function generateSessionToken(password: string): string {
  return Buffer.from(`${password}:${process.env.SESSION_SECRET || 'fallback-secret'}`).toString('base64')
}

// Vérifie si la session admin est valide
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)

  if (!sessionCookie?.value) return false

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false

  const expectedToken = generateSessionToken(adminPassword)
  return sessionCookie.value === expectedToken
}

export { COOKIE_NAME }
