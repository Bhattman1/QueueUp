"use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Phone, MoreHorizontal, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";

interface QueuePageProps {
  params: Promise<{ restaurantId: string }>;
}

export default function QueuePage({ params }: QueuePageProps) {
  const resolvedParams = use(params);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  
  // Temporarily disable database queries due to connection issues
  // const restaurant = useQuery(api.restaurants.getRestaurants, {});
  // const waitlist = useQuery(api.waitlists.getWaitlist, { restaurantId: resolvedParams.restaurantId as any });
  // const entries = useQuery(api.waitlists.getWaitlistEntries, { 
  //   waitlistId: waitlist?._id || "" as any 
  // });
  
  // const restaurant = null; // Force test data
  const waitlist = null; // Force test data
  const entries = null; // Force test data
  
  const pageEntry = null; // Disable mutation
  const seatEntry = null; // Disable mutation
  const markNoShow = null; // Disable mutation

  const handlePageEntry = async () => {
    try {
      if (!pageEntry) {
        // Mock success for demo purposes
        alert("Entry paged successfully! (Demo mode)");
        setSelectedEntry(null);
        return;
      }
      // await pageEntry({ entryId });
      setSelectedEntry(null);
    } catch (error) {
      console.error("Failed to page entry:", error);
      alert("Failed to page entry. Please try again.");
    }
  };

  const handleSeatEntry = async () => {
    try {
      if (!seatEntry) {
        // Mock success for demo purposes
        alert("Entry seated successfully! (Demo mode)");
        setSelectedEntry(null);
        return;
      }
      // await seatEntry({ entryId });
      setSelectedEntry(null);
    } catch (error) {
      console.error("Failed to seat entry:", error);
      alert("Failed to seat entry. Please try again.");
    }
  };

  const handleMarkNoShow = async () => {
    try {
      if (!markNoShow) {
        // Mock success for demo purposes
        alert("Entry marked as no-show! (Demo mode)");
        setSelectedEntry(null);
        return;
      }
      // await markNoShow({ entryId });
      setSelectedEntry(null);
    } catch (error) {
      console.error("Failed to mark no-show:", error);
      alert("Failed to mark no-show. Please try again.");
    }
  };

  // Test data for demo
  const testRestaurant = {
    _id: resolvedParams.restaurantId,
    name: "Chin Chin",
    address: "125 Flinders Ln, Melbourne VIC 3000",
    photos: ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGluIENoaW48L3RleHQ+PC9zdmc+"],
    tags: ["Asian", "Modern", "Trendy"],
    walkInOnly: false,
  };

  const testWaitlist = {
    _id: "test-waitlist",
    restaurantId: resolvedParams.restaurantId,
    isOpen: true,
    avgWaitMins: 15,
  };

  const testEntries = [
    {
      _id: "entry1",
      waitlistId: "test-waitlist",
      name: "John Smith",
      phone: "+61412345678",
      partySize: 2,
      joinSource: "remote",
      joinAt: Date.now() - (30 * 60 * 1000), // 30 minutes ago
      status: "waiting",
      quotedMins: 15,
      etaMins: 10,
      position: 1,
      shareToken: "demo-token-1",
      updates: [{
        ts: Date.now() - (30 * 60 * 1000),
        type: "joined",
        meta: { source: "remote" },
      }],
    },
    {
      _id: "entry2",
      waitlistId: "test-waitlist",
      name: "Sarah Johnson",
      phone: "+61412345679",
      partySize: 4,
      joinSource: "remote",
      joinAt: Date.now() - (20 * 60 * 1000), // 20 minutes ago
      status: "waiting",
      quotedMins: 20,
      etaMins: 15,
      position: 2,
      shareToken: "demo-token-2",
      updates: [{
        ts: Date.now() - (20 * 60 * 1000),
        type: "joined",
        meta: { source: "remote" },
      }],
    },
  ];

  const currentRestaurant = testRestaurant;
  const displayWaitlist = waitlist || testWaitlist;
  const displayEntries = entries || testEntries;

  if (!currentRestaurant || !displayWaitlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/console" className="text-2xl font-bold text-primary">
                Queue Up
              </Link>
              <div className="text-muted-foreground">/</div>
              <h1 className="text-xl font-semibold">{currentRestaurant.name}</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/console" className="text-sm font-medium hover:text-primary">
                Back to Console
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Queue Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Queue Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${displayWaitlist.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  {displayWaitlist.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                People Waiting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayEntries?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayWaitlist.avgWaitMins}m</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayEntries && displayEntries.length > 0 ? `${displayEntries[0].etaMins}m` : 'Now'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Current Queue</CardTitle>
                <CardDescription>
                  {displayEntries?.length || 0} people waiting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {displayEntries && displayEntries.length > 0 ? (
                  <div className="space-y-3">
                    {displayEntries.map((entry) => (
                      <div
                        key={entry._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedEntry === entry._id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedEntry(selectedEntry === entry._id ? null : entry._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {entry.position}
                            </div>
                            <div>
                              <div className="font-medium">{entry.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {entry.partySize} {entry.partySize === 1 ? 'person' : 'people'} • Est. {entry.etaMins}m
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {entry.joinSource}
                            </Badge>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        {entry.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                            <Phone className="h-3 w-3" />
                            {entry.phone}
                          </div>
                        )}
                        
                        {/* {entry.notes && (
                          <div className="text-sm text-muted-foreground mt-2">
                            Note: {entry.notes}
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No one in the queue</p>
                    <p className="text-sm">The queue is empty</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
                <CardDescription>
                  {selectedEntry ? 'Manage selected party' : 'Select a party to manage'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEntry ? (
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => handlePageEntry()}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Page Table Ready
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSeatEntry()}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Seated
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleMarkNoShow()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Mark No-Show
                    </Button>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedEntry(null)}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a party from the queue</p>
                    <p className="text-sm">to manage their status</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Today&apos;s Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Joined</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seated</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">No Shows</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cancelled</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
