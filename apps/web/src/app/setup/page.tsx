"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function SetupPage() {
  const [adminData, setAdminData] = useState({
    clerkId: "",
    name: "",
    email: "",
  });
  
  const createAdminUser = useMutation(api.scripts.createAdminUser);
  const seedRestaurants = useMutation(api.scripts.seedRestaurants);
  
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [isSeedingData, setIsSeedingData] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);
  const [dataSeeded, setDataSeeded] = useState(false);

  const handleCreateAdmin = async () => {
    if (!adminData.clerkId || !adminData.name || !adminData.email) {
      alert("Please fill in all fields");
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await createAdminUser({
        clerkId: adminData.clerkId,
        name: adminData.name,
        email: adminData.email,
      });
      setAdminCreated(true);
      alert("Admin user created successfully!");
    } catch (error) {
      console.error("Failed to create admin:", error);
      alert("Failed to create admin user. It may already exist.");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeedingData(true);
    try {
      await seedRestaurants({});
      setDataSeeded(true);
      alert("Sample restaurants created successfully!");
    } catch (error) {
      console.error("Failed to seed data:", error);
      alert("Failed to create sample data.");
    } finally {
      setIsSeedingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QueueUp Setup</h1>
          <p className="text-gray-600 mt-2">Set up your QueueUp application</p>
        </div>

        <div className="space-y-6">
          {/* Create Admin User */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">1. Create Admin User</h2>
            <p className="text-gray-600 mb-4">
              Create an admin user to manage the platform. You'll need a Clerk user ID for this.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clerk User ID
                </label>
                <Input
                  value={adminData.clerkId}
                  onChange={(e) => setAdminData({ ...adminData, clerkId: e.target.value })}
                  placeholder="user_2abc123def456"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from your Clerk dashboard after signing up
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  value={adminData.name}
                  onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                  placeholder="Admin Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>
              
              <Button 
                onClick={handleCreateAdmin}
                disabled={isCreatingAdmin || adminCreated}
                className="w-full"
              >
                {isCreatingAdmin ? "Creating..." : adminCreated ? "Admin Created ✓" : "Create Admin User"}
              </Button>
            </div>
          </Card>

          {/* Seed Sample Data */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">2. Create Sample Data</h2>
            <p className="text-gray-600 mb-4">
              Create sample restaurants and waitlist data for testing.
            </p>
            
            <Button 
              onClick={handleSeedData}
              disabled={isSeedingData || dataSeeded}
              className="w-full"
            >
              {isSeedingData ? "Creating..." : dataSeeded ? "Data Created ✓" : "Create Sample Data"}
            </Button>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">3. Next Steps</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Sign in with your admin account</p>
              <p>• Visit <code className="bg-gray-100 px-1 rounded">/admin</code> to manage restaurants</p>
              <p>• Visit <code className="bg-gray-100 px-1 rounded">/restaurant-owner</code> to add restaurants</p>
              <p>• Configure external photo sources (Google Places, Unsplash, etc.)</p>
            </div>
          </Card>

          {/* Environment Setup */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Setup</h2>
            <p className="text-gray-600 mb-4">
              Make sure you have the following environment variables set:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CONVEX_URL=https://your_deployment.convex.cloud`}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
