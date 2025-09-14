import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '14px',
            border: '1.5px solid #14b8a6',
            borderRadius: '2px',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '4px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#14b8a6',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '8px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#14b8a6',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '12px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#14b8a6',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
