"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    // Skip redirect on debug/admin pages
    const currentPath = window.location.pathname;
    const debugPages = ['/debug-user', '/make-admin', '/assign-admin', '/setup', '/admin'];
    
    if (debugPages.includes(currentPath)) {
      return; // Don't redirect on debug pages
    }

    if (isLoaded && isSignedIn && currentUser) {
      // Redirect based on user role
      if (currentUser.role === "admin") {
        router.push("/admin");
      } else if (currentUser.role === "restaurant_owner") {
        router.push("/restaurant-owner");
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, isSignedIn, currentUser, router]);

  // Show loading while determining redirect
  if (isLoaded && isSignedIn && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Setting up your account...</h2>
          <p className="text-gray-600 mt-2">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }

  return null;
}
