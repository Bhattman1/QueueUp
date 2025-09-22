"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useUser } from "@clerk/nextjs";

export default function AssignAdminPage() {
  const { user } = useUser();
  const [isAssigning, setIsAssigning] = useState(false);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleAssignAdmin = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    setIsAssigning(true);
    try {
      // First get the current user from Convex
      const convexUser = await currentUser;
      if (!convexUser) {
        alert("User not found in database. Please try signing in again.");
        return;
      }

      await updateUserRole({
        userId: convexUser._id,
        role: "admin",
      });
      
      alert("Admin role assigned successfully! Refreshing page...");
      window.location.reload();
    } catch (error) {
      console.error("Failed to assign admin role:", error);
      alert("Failed to assign admin role. You may need to be an existing admin.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Sign In Required</h1>
          <p className="text-center text-gray-600 mb-4">
            Please sign in to assign admin role
          </p>
          <Button onClick={() => window.location.href = "/sign-in"} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assign Admin Role</h1>
          <p className="text-gray-600 mt-2">Make yourself an admin for testing</p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Current User Info</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Name:</strong> {user.fullName || user.firstName || "Unknown"}</p>
              <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress || "Unknown"}</p>
              <p><strong>Clerk ID:</strong> {user.id}</p>
              <p><strong>Current Role:</strong> {currentUser?.role || "Not synced yet"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Assign Admin Role</h2>
            <p className="text-gray-600 mb-4">
              Click the button below to assign yourself admin privileges. 
              This will allow you to access the admin dashboard.
            </p>
            
            <Button 
              onClick={handleAssignAdmin}
              disabled={isAssigning || currentUser?.role === "admin"}
              className="w-full"
            >
              {isAssigning ? "Assigning..." : 
               currentUser?.role === "admin" ? "Already Admin ✓" : 
               "Assign Admin Role"}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> In production, admin roles should be assigned through a secure process, not through a public page like this.</p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = "/"}
            variant="outline"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
