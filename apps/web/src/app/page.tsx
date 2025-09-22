"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isSignedIn } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser);
  
  // Temporarily disable database query to force test data
  // const restaurants = useQuery(api.restaurants.getTrendingRestaurants, {});
  const restaurants = null; // Force test data
  
  // Temporary hardcoded data for testing images
  const testRestaurants = [
    {
      _id: "test1",
      name: "Chin Chin",
      address: "125 Flinders Ln, Melbourne VIC 3000",
      photos: ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGluIENoaW48L3RleHQ+PC9zdmc+"],
      currentWait: 15,
      tags: ["Asian", "Modern", "Trendy"]
    },
    {
      _id: "test2", 
      name: "Cumulus Inc.",
      address: "45 Flinders Ln, Melbourne VIC 3000",
      photos: ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2I4MmY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DdW11bHVzIEluYy48L3RleHQ+PC9zdmc+"],
      currentWait: 20,
      tags: ["Modern Australian", "Breakfast", "Coffee"]
    },
    {
      _id: "test3",
      name: "Pellegrini's Espresso Bar", 
      address: "66 Bourke St, Melbourne VIC 3000",
      photos: ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QZWxsZWdyaW5pJ3M8L3RleHQ+PC9zdmc+"],
      currentWait: 5,
      tags: ["Coffee", "Italian", "Historic"]
    }
  ];

  const displayRestaurants = restaurants || testRestaurants;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-orange-gradient">Queue Up</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {(currentUser?.role === "admin" || currentUser?.role === "restaurant_owner") && (
                <Link href="/console" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                  Restaurant Console
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 orange-gradient-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-6 text-gray-800">
            Skip the wait, join the queue
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join restaurant waitlists digitally and get real-time updates on your position and estimated wait time.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-orange-500 text-white hover:bg-orange-600 transition-colors">Trending</Badge>
            <Badge className="bg-orange-500 text-white hover:bg-orange-600 transition-colors">Queue Up Only</Badge>
            <Badge className="bg-orange-500 text-white hover:bg-orange-600 transition-colors">Local Favorites</Badge>
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-gray-800 text-center">Popular Restaurants</h3>
          
          {displayRestaurants ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayRestaurants.map((restaurant: any) => (
                <Card key={restaurant._id} className="overflow-hidden hover:orange-shadow transition-all duration-300 bg-white border-orange-200">
                  <div className="relative h-48">
                    <Image
                      src={restaurant.photos[0] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZXN0YXVyYW50PC90ZXh0Pjwvc3ZnPg=="}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500 text-white shadow-md">
                        {restaurant.currentWait}m wait
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{restaurant.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      {restaurant.address}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.tags.map((tag: string) => (
                        <Badge key={tag} className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-orange-500" />
                          {restaurant.currentWait}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-orange-500" />
                          {restaurant.walkInOnly ? "Walk-in only" : "Queue available"}
                        </div>
                      </div>
                      
                      <Button asChild className="orange-gradient hover:orange-glow text-white font-semibold">
                        <Link href={`/r/${restaurant.slug}`}>
                          Join Queue
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading restaurants...</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-200 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; 2024 Queue Up. Skip the wait, join the queue.</p>
        </div>
      </footer>
    </div>
  );
}
