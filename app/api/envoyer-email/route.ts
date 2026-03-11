import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { Resend } from 'resend'

// POST /api/envoyer-email — Envoyer un email de réponse au client (admin seulement)
export async function POST(req: NextRequest) {
  // Vérification auth admin
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  // Vérification de la clé Resend
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { message: 'Service email non configuré (RESEND_API_KEY manquante)' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { destinataire, nomClient, sujet, message } = body

    if (!destinataire || !sujet || !message) {
      return NextResponse.json(
        { message: 'Destinataire, sujet et message sont obligatoires' },
        { status: 400 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'TechAssist <noreply@techassist.fr>'

    // Envoi via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [destinataire],
      subject: sujet,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="margin:0;padding:0;background-color:#0a0f1e;font-family:Inter,system-ui,sans-serif;">
            <div style="max-width:560px;margin:40px auto;padding:0 20px;">
              <!-- Header -->
              <div style="background:linear-gradient(135deg,#1e40af,#2563eb);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
                <div style="display:inline-flex;align-items:center;gap:8px;">
                  <span style="font-size:24px;">⚡</span>
                  <span style="font-size:20px;font-weight:700;color:#fff;">TechAssist</span>
                </div>
              </div>
              <!-- Contenu -->
              <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-top:none;border-radius:0 0 16px 16px;padding:32px;">
                <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">${sujet}</h2>
                <div style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;white-space:pre-line;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
                <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:24px 0;" />
                <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                  TechAssist · Technicien informatique freelance<br/>
                  ${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@techassist.fr'}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('[Resend error]', error)
      return NextResponse.json(
        { message: 'Erreur lors de l\'envoi de l\'email', detail: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailId: data?.id })
  } catch (error) {
    console.error('[POST /api/envoyer-email]', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
