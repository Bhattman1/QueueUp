"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Save, Bell, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

interface SettingsPageProps {
  params: { restaurantId: string };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    bufferMins: 10,
    pagingMessage: "Your table is ready! Please return within 10 minutes.",
    smsEnabled: false,
  });

  const restaurant = useQuery(api.restaurants.getRestaurants, {});
  const currentRestaurant = restaurant?.find(r => r._id === params.restaurantId);

  const handleSave = () => {
    // In a real app, this would save to the database
    alert("Settings saved!");
  };

  if (!currentRestaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
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
              <Link href={`/console/${params.restaurantId}/queue`} className="text-muted-foreground hover:text-foreground">
                {currentRestaurant.name}
              </Link>
              <div className="text-muted-foreground">/</div>
              <h1 className="text-xl font-semibold">Settings</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/console/${params.restaurantId}/queue`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Queue
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Queue Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Queue Settings
              </CardTitle>
              <CardDescription>
                Configure how your waitlist operates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="bufferMins" className="block text-sm font-medium mb-2">
                  Buffer Time (minutes)
                </label>
                <Input
                  id="bufferMins"
                  type="number"
                  min="5"
                  max="30"
                  value={settings.bufferMins}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    bufferMins: parseInt(e.target.value) || 10 
                  }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long guests have to return when paged
                </p>
              </div>

              <div>
                <label htmlFor="pagingMessage" className="block text-sm font-medium mb-2">
                  Paging Message
                </label>
                <textarea
                  id="pagingMessage"
                  className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
                  value={settings.pagingMessage}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    pagingMessage: e.target.value 
                  }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Message sent when a table is ready
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how guests receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">SMS Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Send SMS updates to guests (requires Twilio setup)
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.smsEnabled}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      smsEnabled: e.target.checked 
                    }))}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              {settings.smsEnabled && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                    SMS Setup Required
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    To enable SMS notifications, you need to configure Twilio in your environment variables:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>TWILIO_ACCOUNT_SID</li>
                      <li>TWILIO_AUTH_TOKEN</li>
                      <li>TWILIO_MESSAGING_SERVICE_SID</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Restaurant Information
              </CardTitle>
              <CardDescription>
                Basic information about your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Restaurant Name
                  </label>
                  <Input
                    id="name"
                    value={currentRestaurant.name}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-2">
                    URL Slug
                  </label>
                  <Input
                    id="slug"
                    value={currentRestaurant.slug}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <Input
                    id="address"
                    value={currentRestaurant.address}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentRestaurant.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
