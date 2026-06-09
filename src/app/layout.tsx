import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SettingsTitle from "@/components/SettingsTitle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MinumanPro - Premium Drinks for Premium Moments",
  description: "MinumanPro adalah toko minuman premium UMKM yang menyajikan kopi, teh, smoothie, milk tea, jus segar, dan milkshake berkualitas tinggi. Pesan sekarang dan nikmati minuman terbaik!",
  keywords: ["MinumanPro", "minuman premium", "kopi", "tea", "milk tea", "smoothie", "UMKM", "minuman segar"],
  authors: [{ name: "MinumanPro" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "MinumanPro - Premium Drinks for Premium Moments",
    description: "Toko minuman premium UMKM. Kopi, teh, smoothie, milk tea, jus segar, dan milkshake berkualitas tinggi.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MinumanPro - Premium Drinks",
    description: "Premium Drinks for Premium Moments",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MinumanPro" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <SettingsTitle />
        <Toaster />
      </body>
    </html>
  );
}
