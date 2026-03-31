import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { runtimeConfig } from "../lib/runtime-config";
import { PwaProvider } from "../platform/pwa/components/pwa-provider";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: runtimeConfig.appName,
  title: {
    default: runtimeConfig.appName,
    template: `%s | ${runtimeConfig.appName}`
  },
  description: runtimeConfig.appDescription,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: runtimeConfig.appShortName
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/icons/juyaro-mark.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f7668"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="site-body">
        <PwaProvider />
        {children}
      </body>
    </html>
  );
}
