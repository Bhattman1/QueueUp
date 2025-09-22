import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRestaurants = query({
  args: {},
  handler: async (ctx) => {
    // Only return active restaurants for public consumption
    const restaurants = await ctx.db.query("restaurants").collect();
    return restaurants.filter(restaurant => restaurant.isActive !== false); // Default to active if not set
  },
});

export const getRestaurantBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const restaurant = await ctx.db
      .query("restaurants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    // Only return if restaurant is active (default to active if not set)
    if (restaurant && restaurant.isActive !== false) {
      return restaurant;
    }
    return null;
  },
});

export const getRestaurantsByOrg = query({
  args: { orgId: v.id("orgs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurants")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const getTrendingRestaurants = query({
  args: {
    city: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    radiusKm: v.optional(v.number()),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // For now, return all restaurants with mock trending data
    // In a real app, you'd implement proper trending logic
    const restaurants = await ctx.db.query("restaurants").collect();
    
    // Mock trending: restaurants with shorter wait times are more "trending"
    return restaurants
      .map(restaurant => ({
        ...restaurant,
        currentWait: Math.floor(Math.random() * 60) + 5, // Mock wait time
        trendingScore: Math.random(),
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 20);
  },
});

export const createRestaurant = mutation({
  args: {
    orgId: v.id("orgs"),
    name: v.string(),
    slug: v.string(),
    address: v.string(),
    geo: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    tags: v.array(v.string()),
    walkInOnly: v.boolean(),
    openHours: v.array(v.object({
      day: v.number(),
      open: v.string(),
      close: v.string(),
    })),
    photos: v.array(v.string()),
    settings: v.object({
      smsEnabled: v.boolean(),
      bufferMins: v.number(),
      pagingMessage: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is admin or owns the org
    const org = await ctx.db.get(args.orgId);
    if (!org) {
      throw new Error("Organization not found");
    }

    const isAdmin = user.role === "admin";
    const isOwner = org.ownerUserId === user._id;

    if (!isAdmin && !isOwner) {
      throw new Error("Not authorized to create restaurant for this org");
    }

    return await ctx.db.insert("restaurants", {
      ...args,
      isActive: true, // Default to active
      createdAt: Date.now(),
    });
  },
});

// Admin functions - FORCE REDEPLOY
export const getAllRestaurants = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Not authorized - admin access required");
    }

    // Return all restaurants including inactive ones for admin
    return await ctx.db.query("restaurants").collect();
  },
});

export const updateRestaurantStatus = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Not authorized - admin access required");
    }

    return await ctx.db.patch(args.restaurantId, {
      isActive: args.isActive,
    });
  },
});

export const updateRestaurantPhotos = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    photos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const restaurant = await ctx.db.get(args.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Check if user is admin or owns the restaurant's org
    const org = await ctx.db.get(restaurant.orgId);
    if (!org) {
      throw new Error("Organization not found");
    }

    const isAdmin = user.role === "admin";
    const isOwner = org.ownerUserId === user._id;

    if (!isAdmin && !isOwner) {
      throw new Error("Not authorized to update this restaurant");
    }

    return await ctx.db.patch(args.restaurantId, {
      photos: args.photos,
    });
  },
});

// Simple test function
export const testFunction = query({
  args: {},
  handler: async (ctx) => {
    return { message: "Test function works!", timestamp: Date.now() };
  },
});
