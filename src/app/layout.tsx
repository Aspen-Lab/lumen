"use client";

import { useState } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Sidebar, SidebarTrigger } from "@/components/site/Sidebar";
import { DotGrid } from "@/components/site/DotGrid";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-surface-0 text-white/[0.88] antialiased">
        <DotGrid />
        <div className="relative z-[1] flex min-h-screen">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="flex-1 flex flex-col min-w-0">
            <header className="lg:hidden sticky top-0 z-30 flex items-center h-12 px-4 bg-surface-0/90 backdrop-blur-md">
              <SidebarTrigger onClick={() => setSidebarOpen(true)} />
              <span className="ml-3 text-sm font-medium text-white/40">Lumen</span>
            </header>

            <main className="flex-1 px-6 lg:px-10 py-8 lg:py-10">
              <div className="max-w-content mx-auto">
                {children}
              </div>
            </main>

            <footer className="px-6 lg:px-10 py-6">
              <div className="max-w-content mx-auto text-xs text-white/15">
                Designed & built by Aspen
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
