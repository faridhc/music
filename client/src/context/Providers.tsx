"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { AudioProvider } from "./AudioContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AudioProvider>
        {children}
      </AudioProvider>
    </AuthProvider>
  );
}
