import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appDescription =
  "Mobile-first hypertrophy workout planner and progress tracker";

export const metadata: Metadata = {
  applicationName: "Setwise",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Setwise",
  },
  description: appDescription,
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ sizes: "180x180", type: "image/png", url: "/apple-icon.png" }],
    icon: [{ sizes: "512x512", type: "image/png", url: "/icon.png" }],
  },
  manifest: "/manifest.webmanifest",
  title: "Setwise",
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: "#0f1b2d",
  viewportFit: "cover",
  width: "device-width",
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
      <body className="min-h-full">
        <PwaRegister />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
