import { ImageResponse } from 'next/og';
// App router includes @vercel/og by default through next/og

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic title from query params
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Project Lobby';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 100%)',
            padding: '80px',
          }}
        >
          {/* SVG Grid Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              display: 'flex',
            }}
          >
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#fafafa',
                  borderRadius: '50%',
                }}
              />
              <span
                style={{
                  fontSize: '20px',
                  fontFamily: 'monospace',
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4em',
                }}
              >
                System_Lobby // Archive_2026
              </span>
            </div>

            <h1
              style={{
                fontSize: '120px',
                fontWeight: 900,
                color: '#fafafa',
                lineHeight: 0.8,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                margin: '20px 0',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ color: '#27272a' }}>{title}</span>
              <span>SEONAY_STUDIO</span>
            </h1>

            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginTop: '40px',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                Nantes // FR
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  color: '#3f3f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                }}
              >
                127.0.0.1
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
