"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<"restaurants" | "users" | "orgs">("restaurants");
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const allRestaurants = useQuery(api.restaurants.getRestaurants);
  // Temporarily disable admin-only queries until deployment is fixed
  // const allUsers = useQuery(api.users.getAllUsers);
  // const allOrgs = useQuery(api.users.getAllOrgs);

  // Show loading state while Convex is connecting
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Connecting to database...</h2>
          <p className="text-gray-600 mt-2">Please wait while we connect to Convex</p>
        </div>
      </div>
    );
  }
  
  // Temporarily disabled until deployment is fixed
  // const updateRestaurantStatus = useMutation(api.restaurants.updateRestaurantStatus);
  // const updateUserRole = useMutation(api.users.updateUserRole);

  // Check if user is admin
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
          <p className="text-center text-gray-600">
            You need admin privileges to access this page.
          </p>
        </Card>
      </div>
    );
  }

  // Temporarily disabled until deployment is fixed
  // const handleToggleRestaurantStatus = async (restaurantId: string, isActive: boolean) => {
  //   try {
  //     await updateRestaurantStatus({ 
  //       restaurantId: restaurantId as any, 
  //       isActive: !isActive 
  //     });
  //   } catch (error) {
  //     console.error("Failed to update restaurant status:", error);
  //   }
  // };

  // Temporarily disabled until deployment is fixed
  // const handleUpdateUserRole = async (userId: string, newRole: "admin" | "restaurant_owner" | "customer") => {
  //   try {
  //     await updateUserRole({ 
  //       userId: userId as any, 
  //       role: newRole 
  //     });
  //   } catch (error) {
  //     console.error("Failed to update user role:", error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage restaurants, users, and organizations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "restaurants", label: "Restaurants", count: allRestaurants?.length || 0 },
              { id: "users", label: "Users", count: 0 }, // Temporarily disabled
              { id: "orgs", label: "Organizations", count: 0 }, // Temporarily disabled
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Restaurants Tab */}
        {selectedTab === "restaurants" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Restaurants</h2>
            
            {!allRestaurants ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Convex Connection Required</h3>
                <p className="text-gray-600 mb-4">
                  To manage restaurants, you need to connect to Convex. Here's how to fix the certificate error:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Option 1: Fix Certificate Issue</h4>
                  <p className="text-sm text-gray-600 mb-2">Run this command in your terminal:</p>
                  <code className="block bg-white p-2 rounded text-sm">
                    NODE_TLS_REJECT_UNAUTHORIZED=0 npx convex dev
                  </code>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Option 2: Use Different Network</h4>
                  <p className="text-sm text-gray-600">Try running from a different network (mobile hotspot, etc.)</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Option 3: Manual Setup</h4>
                  <p className="text-sm text-gray-600">Go to <a href="https://convex.dev" target="_blank" className="text-blue-600">convex.dev</a> and create a new deployment manually.</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allRestaurants?.map((restaurant) => (
                <Card key={restaurant._id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">{restaurant.address}</p>
                    </div>
                    <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                      {restaurant.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-1">
                      {restaurant.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={restaurant.isActive ? "destructive" : "default"}
                      disabled
                      title="Restaurant management temporarily unavailable"
                    >
                      {restaurant.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit Photos
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Users</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
              <p className="text-gray-600">User management temporarily unavailable</p>
              <p className="text-sm text-gray-500 mt-2">Admin functions are being deployed</p>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {selectedTab === "orgs" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Organizations</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
              <p className="text-gray-600">Organization management temporarily unavailable</p>
              <p className="text-sm text-gray-500 mt-2">Admin functions are being deployed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
