import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 50%, #0a1a2e 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo mark */}
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
          <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="#10B981" />
          <path d="M5 16 16 14.2 27 16 16 17.8z" fill="#10B981" opacity="0.4" />
        </svg>

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#ffffff',
            marginTop: 16,
            letterSpacing: '-0.04em',
          }}
        >
          Norte
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 12,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Tu copiloto de IA para emprender
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            background: '#10B981',
            borderRadius: 2,
            marginTop: 32,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
