import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/context/Providers";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SonicWave | Premium Music Streaming",
  description: "Listen to legally licensed music, create playlists, and discover new artists with SonicWave.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-28 relative">
              {children}
            </main>
          </div>
          <MusicPlayer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                borderRadius: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
