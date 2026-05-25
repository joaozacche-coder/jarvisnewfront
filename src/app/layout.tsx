import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JARVIS — AI Personal Assistant",
  description: "Your intelligent AI-powered personal assistant. Manage tasks, contacts, finances and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ height: "100%" }}
    >
      <body
        style={{
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflow: "hidden",
            minWidth: 0,
            height: "100%",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
