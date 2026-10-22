import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { Navbar } from "@/components/Navbar";
import { APP_FOOTER_TAGLINE, APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { getNavAuthState } from "@/lib/auth-session";
import { themeInitScript } from "@/lib/theme";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME} - ${APP_TAGLINE}`,
  description:
    "Interactive degree roadmaps for courses, prerequisites, and career paths.",
  icons: {
    icon: "/brand/gauchos-logo.jpg",
    apple: "/brand/gauchos-logo.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getNavAuthState();

  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-gaucho-blue px-4 py-3 font-semibold text-white shadow-lg transition focus:translate-y-0 dark:bg-gaucho-gold dark:text-gaucho-blue-dark"
        >
          Skip to main content
        </a>
        <Navbar initialAuth={initialAuth} />
        <main id="main-content" className="min-w-0 flex-1">{children}</main>
        <footer className="border-t border-gaucho-blue/10 bg-white px-4 py-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] text-center text-xs text-slate-500 dark:border-gaucho-gold/15 dark:bg-gaucho-blue-dark">
          {APP_NAME} · {APP_FOOTER_TAGLINE}
        </footer>
      </body>
    </html>
  );
}
