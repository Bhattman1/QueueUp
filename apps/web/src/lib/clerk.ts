"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export function ClerkClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_demo"}
    >
      {children}
    </ClerkProvider>
  );
}
