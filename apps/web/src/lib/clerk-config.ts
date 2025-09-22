import { clerkClient } from "@clerk/nextjs/server";

export const clerkConfig = {
  // Enable Google OAuth
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Configure redirect URLs
  redirectUrls: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    afterSignIn: "/",
    afterSignUp: "/",
  },
};

// Helper function to configure Clerk instance
export async function configureClerk() {
  try {
    // This would be used in a server-side context
    // to configure Clerk with proper OAuth settings
    return clerkConfig;
  } catch (error) {
    console.error("Failed to configure Clerk:", error);
    return null;
  }
}
