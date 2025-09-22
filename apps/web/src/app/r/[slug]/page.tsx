"use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, QrCode } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { QRCodeComponent } from "@/components/qr-code";

interface RestaurantDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function RestaurantDetailPage({ params }: RestaurantDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    partySize: 2,
  });
  const [isJoining, setIsJoining] = useState(false);

  // Temporarily disable database query to force test data
  // const restaurant = useQuery(api.restaurants.getRestaurantBySlug, { slug: resolvedParams.slug });
  const restaurant = null; // Force test data
  
  // Test restaurant data
  const testRestaurant = {
    _id: "test-restaurant",
    name: "Chin Chin",
    slug: resolvedParams.slug,
    address: "125 Flinders Ln, Melbourne VIC 3000",
    photos: ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGluIENoaW48L3RleHQ+PC9zdmc+"],
    tags: ["Asian", "Modern", "Trendy"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "12:00", close: "22:00" },
      { day: 1, open: "12:00", close: "22:00" },
      { day: 2, open: "12:00", close: "22:00" },
      { day: 3, open: "12:00", close: "22:00" },
      { day: 4, open: "12:00", close: "23:00" },
      { day: 5, open: "12:00", close: "23:00" },
      { day: 6, open: "12:00", close: "22:00" },
    ],
  };

  const displayRestaurant = restaurant || testRestaurant;
  
  // Temporarily disable waitlist queries due to database connection issues
  // const waitlist = useQuery(
  //   api.waitlists.getWaitlist, 
  //   displayRestaurant?._id ? { restaurantId: displayRestaurant._id } : "skip"
  // );
  // const waitlist = null; // Force test data
  const joinWaitlist = null; // Disable mutation

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayRestaurant || !formData.name.trim()) return;

    setIsJoining(true);
    try {
      // Simulate joining waitlist with test data
      if (!joinWaitlist) {
        // Mock success for demo purposes
        const mockShareToken = `demo-token-12345`;
        router.push(`/q/${mockShareToken}`);
        return;
      }

      // const result = await joinWaitlist({
      //   restaurantId: displayRestaurant._id,
      //   name: formData.name,
      //   phone: formData.phone || undefined,
      //   partySize: formData.partySize,
      //   source: "remote",
      // });

      // router.push(`/q/${result.shareToken}`);
    } catch (error) {
      console.error("Failed to join waitlist:", error);
      alert("Failed to join waitlist. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  if (!displayRestaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  const isWaitlistOpen = true; // Default to open for demo

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
                src={displayRestaurant.photos[0] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZXN0YXVyYW50PC90ZXh0Pjwvc3ZnPg=="}
                alt={displayRestaurant.name}
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
              <h1 className="text-3xl font-bold mb-2">{displayRestaurant.name}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                {displayRestaurant.address}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {displayRestaurant.tags.map((tag) => (
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
                    {displayRestaurant.openHours.map((hours, index) => (
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
                        We&apos;ll send you updates about your position
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
                      value="http://localhost:3000/r/chin-chin?join=1" 
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
