import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kirubel Mulat | Student",
  description: "Software Engineering student at Bournemouth University. Building web applications, Discord bots, and exploring modern technologies.",
  keywords: ["Kirubel Mulat", "Software Engineer", "Student", "Developer", "Portfolio", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Kirubel Mulat" }],
  creator: "Kirubel Mulat",
  metadataBase: new URL('https://portfolio-sentrisentri.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: '192x192', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "Kirubel Mulat | Student Software Engineer",
    description: "Software Engineering student at Bournemouth University. Building web applications, Discord bots, and exploring modern technologies.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kirubel Mulat | Student Software Engineer",
    description: "Software Engineering student at Bournemouth University. Building web applications, Discord bots, and exploring modern technologies.",
    creator: "@sentrisentri",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
