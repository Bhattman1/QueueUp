"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, Users, QrCode, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeComponent } from "@/components/qr-code";

interface RestaurantDetailPageProps {
  params: { slug: string };
}

export default function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    partySize: 2,
  });
  const [isJoining, setIsJoining] = useState(false);

  const restaurant = useQuery(api.restaurants.getRestaurantBySlug, { slug: params.slug });
  const waitlist = useQuery(api.waitlists.getWaitlist, { 
    restaurantId: restaurant?._id || "" as any 
  });
  const joinWaitlist = useMutation(api.waitlists.joinWaitlist);

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant || !formData.name.trim()) return;

    setIsJoining(true);
    try {
      const result = await joinWaitlist({
        restaurantId: restaurant._id,
        name: formData.name,
        phone: formData.phone || undefined,
        partySize: formData.partySize,
        source: "remote",
      });

      router.push(`/q/${result.shareToken}`);
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      alert("Failed to join waitlist. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  const isWaitlistOpen = waitlist?.isOpen ?? false;

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
              <Link href="/console" className="text-sm font-medium hover:text-primary">
                Restaurant Console
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={restaurant.photos[0] || "/restaurant.jpg"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/80">
                  {isWaitlistOpen ? "Queue Open" : "Queue Closed"}
                </Badge>
              </div>
            </div>

            {/* Restaurant Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                {restaurant.address}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {restaurant.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Opening Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {restaurant.openHours.map((hours, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">
                          {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][hours.day]}
                        </span>
                        <span className="text-muted-foreground">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Join Queue Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Join the Queue</CardTitle>
                <CardDescription>
                  {isWaitlistOpen 
                    ? "Get in line and receive real-time updates on your position"
                    : "The waitlist is currently closed. Please check back later."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isWaitlistOpen ? (
                  <form onSubmit={handleJoinQueue} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number (Optional)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+61 4XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll send you updates about your position
                      </p>
                    </div>

                    <div>
                      <label htmlFor="partySize" className="block text-sm font-medium mb-2">
                        Party Size
                      </label>
                      <select
                        id="partySize"
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        value={formData.partySize}
                        onChange={(e) => setFormData(prev => ({ ...prev, partySize: parseInt(e.target.value) }))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isJoining || !formData.name.trim()}
                    >
                      {isJoining ? "Joining Queue..." : "Join Queue"}
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                      By joining, you agree to receive updates about your position
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      The waitlist is currently closed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please check back during opening hours
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code for On-site */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  On-site Join
                </CardTitle>
                <CardDescription>
                  Scan this QR code when you arrive at the restaurant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <QRCodeComponent 
                      value={typeof window !== 'undefined' ? `${window.location.href}?join=1` : ''} 
                      size={128}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan to join the queue when you arrive
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
