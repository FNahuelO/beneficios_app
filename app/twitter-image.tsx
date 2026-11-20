import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/seo'

export const runtime = 'edge'
export const alt = `${siteConfig.legalName} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #0A2A32 0%, #0B4F5C 55%, #2EC4B6 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            marginBottom: 20,
          }}
        >
          nexo
        </div>
        <div style={{ display: 'flex', fontSize: 36, opacity: 0.92, maxWidth: 900, lineHeight: 1.3 }}>
          {siteConfig.tagline}
        </div>
        <div style={{ display: 'flex', marginTop: 36, fontSize: 22, opacity: 0.7 }}>
          Salud y Beneficios · Argentina
        </div>
      </div>
    ),
    { ...size }
  )
}
