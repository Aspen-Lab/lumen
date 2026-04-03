"use client";

import { useState } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { Sidebar, SidebarTrigger } from "@/components/site/Sidebar";
import { TopBar } from "@/components/site/TopBar";
import { DotGrid } from "@/components/site/DotGrid";
import { SearchPalette } from "@/components/site/SearchPalette";
import { Cursor } from "@/components/site/Cursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans bg-surface-0 text-white/[0.88] antialiased">
        <DotGrid />
        <SearchPalette />
        <Cursor />
        <div className="relative z-[1] flex min-h-screen">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Slim top bar — just GitHub link + mobile menu */}
            <header className="sticky top-0 z-30 flex items-center justify-between h-12 px-4 lg:px-6 bg-surface-0/95 backdrop-blur-xl border-b border-white/[0.03]">
              <SidebarTrigger onClick={() => setSidebarOpen(true)} />
              <TopBar />
            </header>

            <main className="flex-1 px-6 lg:px-10 py-6 lg:py-8 bg-surface-0/95 backdrop-blur-sm">
              <div className="max-w-content mx-auto">
                {children}
              </div>
            </main>

            <footer className="px-6 lg:px-10 py-4 mt-auto group/footer">
              <div className="max-w-content mx-auto text-[11px] text-white/10 font-mono flex items-center gap-2 group-hover/footer:text-white/20 transition-colors duration-300">
                <span className="inline-block w-1 h-1 rounded-full bg-white/10 group-hover/footer:bg-white/25 transition-colors duration-300" />
                Designed & built by Aspen
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
