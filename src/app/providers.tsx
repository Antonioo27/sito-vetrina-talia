"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={15 * 60}
      refetchOnWindowFocus={false}
      refetchIfOffline={false}
    >
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </SessionProvider>
  );
}
