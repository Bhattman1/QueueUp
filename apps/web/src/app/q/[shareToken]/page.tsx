"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin, Phone, Share2, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StatusPageProps {
  params: { shareToken: string };
}

export default function StatusPage({ params }: StatusPageProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const entry = useQuery(api.waitlists.getEntryByShareToken, { shareToken: params.shareToken });
  const cancelEntry = useMutation(api.waitlists.cancelEntry);

  const handleCancel = async () => {
    if (!entry || !confirm("Are you sure you want to cancel your place in the queue?")) {
      return;
    }

    try {
      await cancelEntry({ entryId: entry._id });
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
          text: `I'm in the queue at ${entry?.name || "the restaurant"}. Track my position here!`,
          url: window.location.href,
        });
      } catch (error) {
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

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your queue status...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "bg-blue-500";
      case "paged": return "bg-yellow-500";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Queue Up
            </Link>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(entry.status)}`}></div>
            </div>
            <CardTitle className="text-2xl">{getStatusText(entry.status)}</CardTitle>
            <CardDescription>
              {entry.status === "waiting" && "You're in the queue"}
              {entry.status === "paged" && "Please return to the restaurant"}
              {entry.status === "seated" && "Enjoy your meal!"}
              {entry.status === "no_show" && "You missed your table"}
              {entry.status === "cancelled" && "You cancelled your place"}
            </CardDescription>
          </CardHeader>
          
          {entry.status === "waiting" && (
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">#{entry.position}</div>
                  <div className="text-sm text-muted-foreground">Position</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{entry.etaMins}m</div>
                  <div className="text-sm text-muted-foreground">Est. Wait</div>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Party Details</div>
                <div className="font-medium">{entry.name}</div>
                <div className="text-sm text-muted-foreground">
                  {entry.partySize} {entry.partySize === 1 ? 'person' : 'people'}
                </div>
                {entry.phone && (
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    {entry.phone}
                  </div>
                )}
              </div>
            </CardContent>
          )}

          {entry.status === "paged" && (
            <CardContent className="text-center space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Your table is ready!
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please return to the restaurant within 10 minutes
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          {entry.status === "waiting" && (
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
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

          <Button variant="outline" className="w-full" asChild>
            <Link href="/">
              <MapPin className="h-4 w-4 mr-2" />
              Find More Restaurants
            </Link>
          </Button>
        </div>

        {/* Recent Updates */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entry.updates.slice(-3).reverse().map((update, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {update.type === "joined" && "Joined the queue"}
                      {update.type === "paged" && "Table ready notification sent"}
                      {update.type === "seated" && "Seated at table"}
                      {update.type === "cancelled" && "Cancelled from queue"}
                      {update.type === "no_show" && "Marked as no-show"}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(update.ts).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>This page updates automatically</p>
          <p>Share this link to let others track your position</p>
        </div>
      </div>
    </div>
  );
}
