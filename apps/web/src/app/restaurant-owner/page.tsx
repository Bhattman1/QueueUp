"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { PhotoUpload } from "../../components/photo-upload";

export default function RestaurantOwnerDashboard() {
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    slug: "",
    address: "",
    lat: "",
    lng: "",
    tags: "",
    walkInOnly: false,
  });
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const userOrgs = useQuery(api.users.getUserOrgs);
  
  const createRestaurant = useMutation(api.restaurants.createRestaurant);
  const updateRestaurantPhotos = useMutation(api.restaurants.updateRestaurantPhotos);

  // Check if user is restaurant owner or admin
  if (!currentUser || (currentUser.role !== "restaurant_owner" && currentUser.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Access Denied</h1>
          <p className="text-center text-gray-600">
            You need restaurant owner privileges to access this page.
          </p>
        </Card>
      </div>
    );
  }

  const handleCreateRestaurant = async () => {
    if (!userOrgs?.[0]) {
      alert("No organization found. Please contact admin.");
      return;
    }

    try {
      await createRestaurant({
        orgId: userOrgs[0]._id,
        name: newRestaurant.name,
        slug: newRestaurant.slug,
        address: newRestaurant.address,
        geo: {
          lat: parseFloat(newRestaurant.lat),
          lng: parseFloat(newRestaurant.lng),
        },
        tags: newRestaurant.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        walkInOnly: newRestaurant.walkInOnly,
        openHours: [
          { day: 0, open: "09:00", close: "21:00" },
          { day: 1, open: "09:00", close: "21:00" },
          { day: 2, open: "09:00", close: "21:00" },
          { day: 3, open: "09:00", close: "21:00" },
          { day: 4, open: "09:00", close: "21:00" },
          { day: 5, open: "09:00", close: "21:00" },
          { day: 6, open: "09:00", close: "21:00" },
        ],
        photos: ["https://placehold.co/600x400/3b82f6/ffffff?text=Restaurant+Photo"],
        settings: {
          smsEnabled: false,
          bufferMins: 10,
          pagingMessage: "Your table is ready! Please return within 10 minutes.",
        },
      });
      
      setNewRestaurant({
        name: "",
        slug: "",
        address: "",
        lat: "",
        lng: "",
        tags: "",
        walkInOnly: false,
      });
      setShowAddRestaurant(false);
    } catch (error) {
      console.error("Failed to create restaurant:", error);
      alert("Failed to create restaurant. Please try again.");
    }
  };

  const handleUpdatePhotos = async (restaurantId: string, photos: string[]) => {
    try {
      await updateRestaurantPhotos({
        restaurantId: restaurantId as any,
        photos,
      });
    } catch (error) {
      console.error("Failed to update photos:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your restaurants and settings</p>
        </div>

        {/* Add Restaurant Button */}
        <div className="mb-8">
          <Button onClick={() => setShowAddRestaurant(!showAddRestaurant)}>
            {showAddRestaurant ? "Cancel" : "Add New Restaurant"}
          </Button>
        </div>

        {/* Add Restaurant Form */}
        {showAddRestaurant && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Restaurant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <Input
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  placeholder="Enter restaurant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL-friendly name)
                </label>
                <Input
                  value={newRestaurant.slug}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, slug: e.target.value })}
                  placeholder="restaurant-name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={newRestaurant.lat}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, lat: e.target.value })}
                  placeholder="e.g., -37.8142"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={newRestaurant.lng}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, lng: e.target.value })}
                  placeholder="e.g., 144.9632"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <Input
                  value={newRestaurant.tags}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, tags: e.target.value })}
                  placeholder="Italian, Fine Dining, Romantic"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="walkInOnly"
                  checked={newRestaurant.walkInOnly}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, walkInOnly: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="walkInOnly" className="text-sm font-medium text-gray-700">
                  Walk-in only (no reservations)
                </label>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleCreateRestaurant}>
                Create Restaurant
              </Button>
            </div>
          </Card>
        )}

        {/* My Restaurants */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">My Restaurants</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userOrgs?.map((org) => (
              <div key={org._id}>
                {/* This would need to be implemented with a query to get restaurants by org */}
                <Card className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{org.name}</h3>
                    <Badge variant="outline">{org.plan}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Plan: {org.plan} | Created: {new Date(org.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Management Section */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold">Photo Management</h2>
          <PhotoUpload
            restaurantId="demo-restaurant"
            currentPhotos={["https://placehold.co/600x400/3b82f6/ffffff?text=Restaurant+Photo"]}
            onPhotosUpdate={(photos) => {
              console.log("Photos updated:", photos);
              // In a real app, this would call the updateRestaurantPhotos mutation
            }}
          />
        </div>
      </div>
    </div>
  );
}
