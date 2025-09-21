"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ConsolePage() {
  const restaurants = useQuery(api.restaurants.getRestaurants, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Queue Up
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Public Site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Restaurant Console</h1>
          <p className="text-muted-foreground">
            Manage your restaurant waitlists and track performance
          </p>
        </div>

        {restaurants ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={restaurant.photos[0] || "/restaurant.jpg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/80">
                      {restaurant.walkInOnly ? "Walk-in Only" : "Queue Available"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {restaurant.address}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Avg 15m wait
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        3 in queue
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/console/${restaurant._id}/settings`}>
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/console/${restaurant._id}/queue`}>
                          Manage Queue
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading restaurants...</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Restaurants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurants?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Queues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Guests Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12m</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
