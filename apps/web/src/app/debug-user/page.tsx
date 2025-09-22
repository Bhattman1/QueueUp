"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function DebugUserPage() {
  const { user, isSignedIn } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const createUser = useMutation(api.users.createUser);
  const updateUserRole = useMutation(api.users.updateUserRole);

  const handleCreateAdmin = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      await createUser({
        clerkId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0]?.emailAddress || "",
      });
      alert("Admin user created! Refreshing...");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating user: " + error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateToAdmin = async () => {
    if (!currentUser) return;
    
    setIsUpdating(true);
    try {
      await updateUserRole({
        userId: currentUser._id,
        role: "admin",
      });
      alert("Role updated to admin! Refreshing...");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating role: " + error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">User Debug Info</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Clerk User Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Clerk User Info</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Signed In:</strong> {isSignedIn ? "Yes" : "No"}</p>
              {user && (
                <>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
                  <p><strong>Full Name:</strong> {user.fullName}</p>
                </>
              )}
            </div>
          </Card>

          {/* Convex User Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Convex User Info</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Synced:</strong> {currentUser ? "Yes" : "No"}</p>
              {currentUser && (
                <>
                  <p><strong>ID:</strong> {currentUser._id}</p>
                  <p><strong>Clerk ID:</strong> {currentUser.clerkId}</p>
                  <p><strong>Name:</strong> {currentUser.name}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Role:</strong> <span className={`font-bold ${currentUser.role === "admin" ? "text-green-600" : "text-red-600"}`}>{currentUser.role}</span></p>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            {!currentUser && (
              <div>
                <p className="text-gray-600 mb-2">User not synced to Convex yet.</p>
                <Button onClick={handleCreateAdmin} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Admin User"}
                </Button>
              </div>
            )}
            
            {currentUser && currentUser.role !== "admin" && (
              <div>
                <p className="text-gray-600 mb-2">User exists but not admin.</p>
                <Button onClick={handleUpdateToAdmin} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Make Admin"}
                </Button>
              </div>
            )}
            
            {currentUser && currentUser.role === "admin" && (
              <div>
                <p className="text-green-600 mb-2">✅ You are an admin!</p>
                <Button onClick={() => window.location.href = "/admin"}>
                  Go to Admin Dashboard
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Raw Data */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Raw Data</h2>
          <div className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            <pre>{JSON.stringify({ clerkUser: user, convexUser: currentUser }, null, 2)}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
