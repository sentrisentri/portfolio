import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
