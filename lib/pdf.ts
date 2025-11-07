import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

interface CredentialData {
  id: string
  nombreCompleto: string
  documento: string
  numeroSocio: string | null
  estado: string
}

export async function generateCredentialPDF(data: CredentialData): Promise<Buffer> {
  const doc = new jsPDF()

  // Título
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235)
  doc.text('Credencial Digital', 105, 20, { align: 'center' })

  // Línea separadora
  doc.setDrawColor(203, 213, 225)
  doc.line(20, 30, 190, 30)

  // Información del socio
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Nombre Completo:', 20, 50)
  doc.setFont('helvetica', 'bold')
  doc.text(data.nombreCompleto, 20, 57)

  doc.setFont('helvetica', 'normal')
  doc.text('Documento:', 20, 70)
  doc.setFont('helvetica', 'bold')
  doc.text(data.documento, 20, 77)

  if (data.numeroSocio) {
    doc.setFont('helvetica', 'normal')
    doc.text('Número de Socio:', 20, 90)
    doc.setFont('helvetica', 'bold')
    doc.text(data.numeroSocio, 20, 97)
  }

  doc.setFont('helvetica', 'normal')
  doc.text('Estado:', 20, 110)
  doc.setFont('helvetica', 'bold')

  if (data.estado === 'APROBADO') {
    doc.setTextColor(16, 185, 129)
    doc.text('APROBADO', 20, 117)
  } else {
    doc.setTextColor(239, 68, 68)
    doc.text(data.estado, 20, 117)
  }

  // Generar QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(data.id, {
      width: 200,
      margin: 2,
    })

    doc.addImage(qrDataUrl, 'PNG', 130, 40, 60, 60)

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Escanear código QR', 160, 108, { align: 'center' })
  } catch (error) {
    console.error('Error generando QR:', error)
  }

  // Footer
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Este documento es válido como credencial digital', 105, 270, { align: 'center' })
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-AR')}`, 105, 277, { align: 'center' })

  return Buffer.from(doc.output('arraybuffer'))
}
