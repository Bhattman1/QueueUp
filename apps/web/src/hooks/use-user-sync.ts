"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useUserSync() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const createUser = useMutation(api.users.createUser);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (isSignedIn && user) {
      // Create or update user in Convex when Clerk user changes
      createUser({
        clerkId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.fullName || "User",
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "",
      }).then((userId) => {
        // Skip redirect on debug/admin pages
        const currentPath = window.location.pathname;
        const debugPages = ['/debug-user', '/make-admin', '/assign-admin', '/setup', '/admin'];
        
        if (debugPages.includes(currentPath)) {
          return; // Don't redirect on debug pages
        }

        // After user is created, we can update their role if needed
        // For now, just proceed with the redirect logic
        // After user is created/synced, redirect based on role
        setTimeout(() => {
          if (currentUser?.role === "admin") {
            router.push("/admin");
          } else if (currentUser?.role === "restaurant_owner") {
            router.push("/restaurant-owner");
          } else {
            router.push("/");
          }
        }, 1000); // Small delay to ensure user is synced
      }).catch((error) => {
        console.error("Failed to sync user:", error);
        // Skip redirect on debug pages even if sync fails
        const currentPath = window.location.pathname;
        const debugPages = ['/debug-user', '/make-admin', '/assign-admin', '/setup', '/admin'];
        
        if (!debugPages.includes(currentPath)) {
          router.push("/");
        }
      });
    }
  }, [isSignedIn, user, createUser, currentUser, router]);
}
