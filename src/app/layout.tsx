import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../../layout/header";
import { AvatarBackground } from "../../layout/avatar-background";
import { AccessibilityPanel } from "@/components/ui/accessibility-panel";
import { AccessibilityProvider } from "@/components/ui/accessibility-provider";
import { SkipLink } from "@/components/ui/skip-link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Symulator Emerytalny",
  description: "TODO: Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased px-20`}
      >
        <AccessibilityProvider>
          <SkipLink />
          <Header />
          <AvatarBackground circlePosition="middle" assistant="hand-raised">
            <main id="main-content" role="main">
              {children}
            </main>
          </AvatarBackground>
          <AccessibilityPanel />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
