"use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Share2, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StatusPageProps {
  params: { shareToken: string };
}

export default function StatusPage({ params }: StatusPageProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Temporarily disable database queries due to connection issues
  // const entry = useQuery(api.waitlists.getEntryByShareToken, { shareToken: params.shareToken });
  // const cancelEntry = useMutation(api.waitlists.cancelEntry);
  
  const entry = null; // Force test data
  const cancelEntry = null; // Disable mutation

  // Test data for demo
  const testEntry = {
    _id: "test-entry",
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
    shareToken: params.shareToken,
    updates: [{
      ts: Date.now() - (30 * 60 * 1000),
      type: "joined",
      meta: { source: "remote" },
    }],
  };

  const displayEntry = entry || testEntry;

  const handleCancel = async () => {
    if (!displayEntry || !confirm("Are you sure you want to cancel your place in the queue?")) {
      return;
    }

    try {
      if (!cancelEntry) {
        // Mock success for demo purposes
        alert("Your place in the queue has been cancelled! (Demo mode)");
        return;
      }
      // await cancelEntry({ entryId: displayEntry._id });
      alert("Your place in the queue has been cancelled.");
    } catch (error) {
      console.error("Failed to cancel entry:", error);
      alert("Failed to cancel. Please try again.");
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Queue Status - Queue Up",
          text: `I'm in the queue at ${displayEntry?.name || "the restaurant"}. Track my position here!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  if (!displayEntry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your queue status...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "bg-orange-500";
      case "paged": return "bg-orange-400";
      case "seated": return "bg-green-500";
      case "no_show": return "bg-red-500";
      case "cancelled": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting": return "Waiting";
      case "paged": return "Your table is ready!";
      case "seated": return "Seated";
      case "no_show": return "No Show";
      case "cancelled": return "Cancelled";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-orange-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-orange-gradient">
              Queue Up
            </Link>
            <Button variant="outline" size="sm" onClick={handleShare} className="border-orange-200 text-orange-600 hover:bg-orange-50">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Status Card */}
        <Card className="mb-6 bg-white border-orange-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-6 h-6 rounded-full ${getStatusColor(displayEntry.status)} shadow-md`}></div>
            </div>
            <CardTitle className="text-2xl text-gray-800">{getStatusText(displayEntry.status)}</CardTitle>
            <CardDescription className="text-gray-600">
              {displayEntry.status === "waiting" && "You're in the queue"}
              {displayEntry.status === "paged" && "Please return to the restaurant"}
              {displayEntry.status === "seated" && "Enjoy your meal!"}
              {displayEntry.status === "no_show" && "You missed your table"}
              {displayEntry.status === "cancelled" && "You cancelled your place"}
            </CardDescription>
          </CardHeader>
          
          {displayEntry.status === "waiting" && (
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">#{displayEntry.position}</div>
                  <div className="text-sm text-gray-600">Position</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{displayEntry.etaMins}m</div>
                  <div className="text-sm text-gray-600">Est. Wait</div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="text-sm text-orange-700 mb-2 font-medium">Party Details</div>
                <div className="font-medium text-gray-800">{displayEntry.name}</div>
                <div className="text-sm text-gray-600">
                  {displayEntry.partySize} {displayEntry.partySize === 1 ? 'person' : 'people'}
                </div>
                {displayEntry.phone && (
                  <div className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                    <Phone className="h-3 w-3 text-orange-500" />
                    {displayEntry.phone}
                  </div>
                )}
              </div>
            </CardContent>
          )}

          {displayEntry.status === "paged" && (
            <CardContent className="text-center space-y-4">
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                <div className="text-orange-800 font-medium">
                  Your table is ready!
                </div>
                <div className="text-sm text-orange-700 mt-1">
                  Please return to the restaurant within 10 minutes
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          {displayEntry.status === "waiting" && (
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <Bell className="h-4 w-4 mr-2" />
                {notificationsEnabled ? "Notifications On" : "Enable Notifications"}
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel Queue
              </Button>
            </div>
          )}

          <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50" asChild>
            <Link href="/">
              <MapPin className="h-4 w-4 mr-2" />
              Find More Restaurants
            </Link>
          </Button>
        </div>

        {/* Recent Updates */}
        <Card className="mt-6 bg-white border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayEntry.updates.slice(-3).reverse().map((update, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {update.type === "joined" && "Joined the queue"}
                      {update.type === "paged" && "Table ready notification sent"}
                      {update.type === "seated" && "Seated at table"}
                      {update.type === "cancelled" && "Cancelled from queue"}
                      {update.type === "no_show" && "Marked as no-show"}
                    </div>
                    <div className="text-gray-600">
                      {new Date(update.ts).toLocaleTimeString('en-US', { 
                        hour12: true, 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>This page updates automatically</p>
          <p>Share this link to let others track your position</p>
        </div>
      </div>
    </div>
  );
}
