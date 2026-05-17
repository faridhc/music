"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { AudioProvider } from "./AudioContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AudioProvider>
          {children}
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
