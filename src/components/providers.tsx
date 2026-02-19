"use client";

import { ReactNode, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { MiniAppContextProvider } from "@/lib/contexts/miniapp-context";

export function Providers({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Farcaster SDK
    const init = async () => {
      try {
        // Wait for app to be fully loaded
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        // Signal that the app is ready to display
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        // Still show app even if SDK fails
        setIsReady(true);
      }
    };

    init();
  }, []);

  return (
    <MiniAppContextProvider>
      <div className="relative min-h-screen">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-hero-gradient grid-bg opacity-50 pointer-events-none" />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-kainova-dark/50 to-kainova-dark pointer-events-none" />
        
        {/* Content */}
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </MiniAppContextProvider>
  );
}
