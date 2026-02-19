"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { sdk } from "@farcaster/miniapp-sdk";

// Define context type based on SDK - make properties optional to match SDK
interface FrameContext {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  client?: {
    clientFid: number;
    added: boolean;
  };
}

interface MiniAppContextType {
  context: FrameContext | null;
  isLoading: boolean;
  error: Error | null;
  user: {
    fid: number | null;
    username: string | null;
    displayName: string | null;
    pfpUrl: string | null;
  };
}

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppContextProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<FrameContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load context"));
      } finally {
        setIsLoading(false);
      }
    };

    loadContext();
  }, []);

  const user = {
    fid: context?.user?.fid ?? null,
    username: context?.user?.username ?? null,
    displayName: context?.user?.displayName ?? null,
    pfpUrl: context?.user?.pfpUrl ?? null,
  };

  return (
    <MiniAppContext.Provider value={{ context, isLoading, error, user }}>
      {children}
    </MiniAppContext.Provider>
  );
}

export function useMiniApp() {
  const context = useContext(MiniAppContext);
  if (context === undefined) {
    throw new Error("useMiniApp must be used within a MiniAppContextProvider");
  }
  return context;
}
