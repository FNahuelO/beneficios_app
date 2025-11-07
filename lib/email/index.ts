import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Si no hay RESEND_API_KEY configurado, solo logueamos el email
  if (!resend || !process.env.EMAIL_FROM) {
    console.log('📧 Email (modo desarrollo):', { to, subject })
    console.log('HTML:', html)
    return { success: true, messageId: 'dev-mode' }
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })

    return { success: true, messageId: data.id }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, error }
  }
}

// Templates de emails

export function emailRegistroRecibido(nombreCompleto: string) {
  return {
    subject: 'Recibimos tu solicitud de registro',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Solicitud Recibida</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombreCompleto}</strong>,</p>
              <p>Hemos recibido tu solicitud de registro exitosamente.</p>
              <p>Un administrador revisará tu solicitud y te notificaremos por email cuando sea aprobada.</p>
              <p>Gracias por tu paciencia.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Mi Organización. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function emailSolicitudAprobada(nombreCompleto: string, credencialUrl: string) {
  return {
    subject: '¡Tu solicitud fue aprobada! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Solicitud Aprobada!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombreCompleto}</strong>,</p>
              <p>¡Excelentes noticias! Tu solicitud de registro ha sido aprobada.</p>
              <p>Ya podés acceder a tu credencial digital y disfrutar de todos los beneficios.</p>
              <p style="text-align: center;">
                <a href="${credencialUrl}" class="button">Ver mi credencial</a>
              </p>
              <p>Guardá el link de tu credencial para consultarla cuando lo necesites.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Mi Organización. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

export function emailSolicitudRechazada(nombreCompleto: string, comentario: string) {
  return {
    subject: 'Actualización sobre tu solicitud',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; }
            .comment { background: white; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Actualización de Solicitud</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombreCompleto}</strong>,</p>
              <p>Lamentablemente, tu solicitud de registro no pudo ser aprobada en este momento.</p>
              <div class="comment">
                <strong>Motivo:</strong><br>
                ${comentario}
              </div>
              <p>Si tenés alguna consulta, no dudes en contactarte con nosotros.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Mi Organización. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
