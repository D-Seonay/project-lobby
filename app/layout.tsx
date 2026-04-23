import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lobby.seonay.com"),
  title: "Mathéo Delaunay | Creative Bento Lobby // Seonay Studio",
  description: "Expert Next.js developer and digital designer specializing in high-performance architectural frameworks and radical dark mode experiments.",
  keywords: ["Mathéo Delaunay", "Seonay Studio", "Next.js", "Webdesign", "Bento Grid", "Portfolio", "Freelance Nantes"],
  authors: [{ name: "Mathéo Delaunay" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Mathéo Delaunay | Creative Bento Lobby // Seonay Studio",
    description: "Expert Next.js developer and digital designer specializing in high-performance architectural frameworks and radical dark mode experiments.",
    url: "https://lobby.seonay.com",
    siteName: "Seonay Studio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Mathéo Delaunay | Seonay Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mathéo Delaunay | Creative Bento Lobby // Seonay Studio",
    description: "Expert Next.js developer and digital designer specializing in high-performance architectural frameworks and radical dark mode experiments.",
    site: "@seonaystudio",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black">
        {/* SVG Grid Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.15]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="gridPattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.1"
                />
              </pattern>
              <radialGradient id="radialMask" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id="gridMask">
                <rect width="100%" height="100%" fill="url(#radialMask)" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#gridPattern)"
              mask="url(#gridMask)"
            />
          </svg>
        </div>

        {/* Noise Texture Overlay */}
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        />

        {children}
      </body>
    </html>
  );
}
