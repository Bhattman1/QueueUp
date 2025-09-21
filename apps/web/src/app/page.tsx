"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const restaurants = useQuery(api.restaurants.getTrendingRestaurants, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Queue Up</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/console" className="text-sm font-medium hover:text-primary">
                Restaurant Console
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Skip the wait, join the queue
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join restaurant waitlists digitally and get real-time updates on your position and estimated wait time.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary">Trending</Badge>
            <Badge variant="secondary">Queue Up Only</Badge>
            <Badge variant="secondary">Local Favorites</Badge>
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">Popular Restaurants</h3>
          
          {restaurants ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant: any) => (
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
                        {restaurant.currentWait}m wait
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
                      {restaurant.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {restaurant.currentWait}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {restaurant.walkInOnly ? "Walk-in only" : "Queue available"}
                        </div>
                      </div>
                      
                      <Button asChild>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading restaurants...</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Queue Up. Skip the wait, join the queue.</p>
        </div>
      </footer>
    </div>
  );
}
