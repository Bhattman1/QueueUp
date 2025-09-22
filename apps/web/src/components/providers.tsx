"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Navigation } from "./navigation";
import { useUserSync } from "../hooks/use-user-sync";
import { AuthRedirect } from "./auth-redirect";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://blessed-owl-95.convex.cloud");

function UserSync() {
  useUserSync();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_demo"}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        <AuthRedirect />
        <Navigation />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
