"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function MakeAdminPage() {
  const { user, isSignedIn } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const createUser = useMutation(api.users.createUser);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleCreateOrUpdateAdmin = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    try {
      if (!currentUser) {
        // User doesn't exist in Convex yet, create them as admin
        setIsCreating(true);
        await createUser({
          clerkId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0]?.emailAddress || "",
        });
        alert("Admin user created successfully! Refreshing page...");
      } else {
        // User exists, update their role to admin
        setIsUpdating(true);
        await updateUserRole({
          userId: currentUser._id,
          role: "admin",
        });
        alert("Admin role assigned successfully! Refreshing page...");
      }
      
      // Refresh the page to update the user data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Failed to create/update admin:", error);
      alert("Failed to create/update admin. Please try again.");
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Sign In Required</h1>
          <p className="text-center text-gray-600 mb-4">
            Please sign in to make yourself an admin
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
          <h1 className="text-3xl font-bold text-gray-900">Make Yourself Admin</h1>
          <p className="text-gray-600 mt-2">Assign admin privileges to your account</p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Account Info</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Clerk ID:</strong> {user.id}</p>
              <p><strong>Current Role:</strong> {currentUser?.role || "Not synced yet"}</p>
              <p><strong>Status:</strong> {currentUser ? "Synced to Convex" : "Not in Convex database"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Admin Assignment</h2>
            <p className="text-gray-600 mb-4">
              Click the button below to assign yourself admin privileges. This will allow you to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Access the admin dashboard</li>
              <li>Manage all restaurants</li>
              <li>Activate/deactivate restaurants</li>
              <li>Change user roles</li>
              <li>View all organizations</li>
            </ul>
            
            <Button 
              onClick={handleCreateOrUpdateAdmin}
              disabled={isCreating || isUpdating || currentUser?.role === "admin"}
              className="w-full"
            >
              {isCreating ? "Creating Admin..." : 
               isUpdating ? "Updating Role..." :
               currentUser?.role === "admin" ? "Already Admin ✓" : 
               "Make Me Admin"}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> This is a one-time setup. Once you're an admin, you can manage other users through the admin dashboard.</p>
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
