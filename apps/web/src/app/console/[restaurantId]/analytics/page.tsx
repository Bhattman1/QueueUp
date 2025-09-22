"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";

interface AnalyticsPageProps {
  params: { restaurantId: string };
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const restaurant = useQuery(api.restaurants.getRestaurants, {});
  const currentRestaurant = restaurant?.find(r => r._id === params.restaurantId);

  // Mock data for charts
  const waitByHourData = [
    { hour: "12pm", wait: 15 },
    { hour: "1pm", wait: 22 },
    { hour: "2pm", wait: 18 },
    { hour: "3pm", wait: 12 },
    { hour: "4pm", wait: 8 },
    { hour: "5pm", wait: 25 },
    { hour: "6pm", wait: 35 },
    { hour: "7pm", wait: 28 },
    { hour: "8pm", wait: 20 },
    { hour: "9pm", wait: 15 },
  ];

  const conversionData = [
    { day: "Mon", joined: 45, seated: 38 },
    { day: "Tue", joined: 52, seated: 44 },
    { day: "Wed", joined: 38, seated: 32 },
    { day: "Thu", joined: 61, seated: 52 },
    { day: "Fri", joined: 78, seated: 65 },
    { day: "Sat", joined: 89, seated: 72 },
    { day: "Sun", joined: 67, seated: 58 },
  ];

  const dropOffData = [
    { reason: "No Show", count: 8 },
    { reason: "Cancelled", count: 12 },
    { reason: "Walk Away", count: 5 },
    { reason: "Long Wait", count: 3 },
  ];

  if (!currentRestaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
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
              <h1 className="text-xl font-semibold">Analytics</h1>
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

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18m</div>
              <p className="text-xs text-muted-foreground">-2m from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Joins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Seated Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+3% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Drop-off Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22%</div>
              <p className="text-xs text-muted-foreground">-1% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wait Time by Hour */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Wait Time by Hour</CardTitle>
              <CardDescription>
                Peak wait times throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={waitByHourData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wait" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Conversion</CardTitle>
              <CardDescription>
                Joins vs Seated by day of week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="joined" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="seated" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Drop-off Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Drop-off Reasons</CardTitle>
              <CardDescription>
                Why guests leave the queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dropOffData.map((item) => (
                  <div key={item.reason} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.reason}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(item.count / 28) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Last 10 queue events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "2:45 PM", event: "Sarah Johnson seated", type: "seated" },
                  { time: "2:30 PM", event: "Mike Chen paged", type: "paged" },
                  { time: "2:15 PM", event: "Emma Wilson joined", type: "joined" },
                  { time: "2:00 PM", event: "David Brown cancelled", type: "cancelled" },
                  { time: "1:45 PM", event: "Lisa Wang no-show", type: "no_show" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'seated' ? 'bg-green-500' :
                      activity.type === 'paged' ? 'bg-yellow-500' :
                      activity.type === 'joined' ? 'bg-blue-500' :
                      activity.type === 'cancelled' ? 'bg-gray-500' :
                      'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.event}</div>
                      <div className="text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
