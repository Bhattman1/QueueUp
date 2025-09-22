import { mutation } from "../convex/_generated/server";
import { v } from "convex/values";

const melbourneRestaurants = [
  {
    name: "Chin Chin",
    slug: "chin-chin",
    address: "125 Flinders Ln, Melbourne VIC 3000",
    geo: { lat: -37.8176, lng: 144.9707 },
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
    photos: ["https://placehold.co/600x400/ef4444/ffffff?text=Chin+Chin"],
  },
  {
    name: "Cumulus Inc.",
    slug: "cumulus-inc",
    address: "45 Flinders Ln, Melbourne VIC 3000",
    geo: { lat: -37.8176, lng: 144.9707 },
    tags: ["Modern Australian", "Breakfast", "Coffee"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "07:00", close: "15:00" },
      { day: 1, open: "07:00", close: "15:00" },
      { day: 2, open: "07:00", close: "15:00" },
      { day: 3, open: "07:00", close: "15:00" },
      { day: 4, open: "07:00", close: "15:00" },
      { day: 5, open: "07:00", close: "15:00" },
      { day: 6, open: "07:00", close: "15:00" },
    ],
    photos: ["https://placehold.co/600x400/3b82f6/ffffff?text=Cumulus+Inc"],
  },
  {
    name: "Pellegrini's Espresso Bar",
    slug: "pellegrinis-espresso",
    address: "66 Bourke St, Melbourne VIC 3000",
    geo: { lat: -37.8142, lng: 144.9632 },
    tags: ["Coffee", "Italian", "Historic"],
    walkInOnly: true,
    openHours: [
      { day: 0, open: "08:00", close: "23:30" },
      { day: 1, open: "08:00", close: "23:30" },
      { day: 2, open: "08:00", close: "23:30" },
      { day: 3, open: "08:00", close: "23:30" },
      { day: 4, open: "08:00", close: "23:30" },
      { day: 5, open: "08:00", close: "23:30" },
      { day: 6, open: "08:00", close: "23:30" },
    ],
    photos: ["https://placehold.co/600x400/10b981/ffffff?text=Pellegrini%27s"],
  },
  {
    name: "Flower Drum",
    slug: "flower-drum",
    address: "17 Market Ln, Melbourne VIC 3000",
    geo: { lat: -37.8142, lng: 144.9632 },
    tags: ["Chinese", "Fine Dining", "Luxury"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "18:00", close: "22:00" },
      { day: 1, open: "18:00", close: "22:00" },
      { day: 2, open: "18:00", close: "22:00" },
      { day: 3, open: "18:00", close: "22:00" },
      { day: 4, open: "18:00", close: "22:00" },
      { day: 5, open: "18:00", close: "22:00" },
      { day: 6, open: "18:00", close: "22:00" },
    ],
    photos: ["https://placehold.co/600x400/f59e0b/ffffff?text=Flower+Drum"],
  },
  {
    name: "Gazi",
    slug: "gazi",
    address: "2 Exhibition St, Melbourne VIC 3000",
    geo: { lat: -37.8142, lng: 144.9632 },
    tags: ["Greek", "Modern", "Rooftop"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "17:30", close: "22:00" },
      { day: 1, open: "17:30", close: "22:00" },
      { day: 2, open: "17:30", close: "22:00" },
      { day: 3, open: "17:30", close: "22:00" },
      { day: 4, open: "17:30", close: "22:00" },
      { day: 5, open: "17:30", close: "22:00" },
      { day: 6, open: "17:30", close: "22:00" },
    ],
    photos: ["https://placehold.co/600x400/8b5cf6/ffffff?text=Gazi"],
  },
  {
    name: "Supernormal",
    slug: "supernormal",
    address: "180 Flinders Ln, Melbourne VIC 3000",
    geo: { lat: -37.8176, lng: 144.9707 },
    tags: ["Asian Fusion", "Modern", "Trendy"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "12:00", close: "22:00" },
      { day: 1, open: "12:00", close: "22:00" },
      { day: 2, open: "12:00", close: "22:00" },
      { day: 3, open: "12:00", close: "22:00" },
      { day: 4, open: "12:00", close: "22:00" },
      { day: 5, open: "12:00", close: "22:00" },
      { day: 6, open: "12:00", close: "22:00" },
    ],
    photos: ["https://placehold.co/600x400/ef4444/ffffff?text=Supernormal"],
  },
  {
    name: "Attica",
    slug: "attica",
    address: "74 Glen Eira Rd, Ripponlea VIC 3185",
    geo: { lat: -37.8764, lng: 145.0000 },
    tags: ["Fine Dining", "Australian", "Award Winning"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "18:00", close: "22:00" },
      { day: 1, open: "18:00", close: "22:00" },
      { day: 2, open: "18:00", close: "22:00" },
      { day: 3, open: "18:00", close: "22:00" },
      { day: 4, open: "18:00", close: "22:00" },
      { day: 5, open: "18:00", close: "22:00" },
      { day: 6, open: "18:00", close: "22:00" },
    ],
    photos: ["https://placehold.co/600x400/059669/ffffff?text=Attica"],
  },
  {
    name: "Lune Croissanterie",
    slug: "lune-croissanterie",
    address: "119 Rose St, Fitzroy VIC 3065",
    geo: { lat: -37.7964, lng: 144.9784 },
    tags: ["Pastry", "Coffee", "Popular"],
    walkInOnly: true,
    openHours: [
      { day: 0, open: "07:30", close: "15:00" },
      { day: 1, open: "07:30", close: "15:00" },
      { day: 2, open: "07:30", close: "15:00" },
      { day: 3, open: "07:30", close: "15:00" },
      { day: 4, open: "07:30", close: "15:00" },
      { day: 5, open: "07:30", close: "15:00" },
      { day: 6, open: "07:30", close: "15:00" },
    ],
    photos: ["https://placehold.co/600x400/f97316/ffffff?text=Lune"],
  },
  {
    name: "Movida",
    slug: "movida",
    address: "1 Hosier Ln, Melbourne VIC 3000",
    geo: { lat: -37.8176, lng: 144.9707 },
    tags: ["Spanish", "Tapas", "Wine Bar"],
    walkInOnly: false,
    openHours: [
      { day: 0, open: "17:00", close: "23:00" },
      { day: 1, open: "17:00", close: "23:00" },
      { day: 2, open: "17:00", close: "23:00" },
      { day: 3, open: "17:00", close: "23:00" },
      { day: 4, open: "17:00", close: "23:00" },
      { day: 5, open: "17:00", close: "23:00" },
      { day: 6, open: "17:00", close: "23:00" },
    ],
    photos: ["https://placehold.co/600x400/dc2626/ffffff?text=Movida"],
  },
  {
    name: "Brothl",
    slug: "brothl",
    address: "123 Lonsdale St, Melbourne VIC 3000",
    geo: { lat: -37.8142, lng: 144.9632 },
    tags: ["Healthy", "Soup", "Quick"],
    walkInOnly: true,
    openHours: [
      { day: 0, open: "11:00", close: "19:00" },
      { day: 1, open: "11:00", close: "19:00" },
      { day: 2, open: "11:00", close: "19:00" },
      { day: 3, open: "11:00", close: "19:00" },
      { day: 4, open: "11:00", close: "19:00" },
      { day: 5, open: "11:00", close: "19:00" },
      { day: 6, open: "11:00", close: "19:00" },
    ],
    photos: ["https://placehold.co/600x400/16a34a/ffffff?text=Brothl"],
  },
];

export const seedRestaurants = mutation({
  args: {},
  handler: async (ctx) => {
    // Create demo org and user first
    const demoUserId = await ctx.db.insert("users", {
      clerkId: "demo-user-123",
      name: "Demo Restaurant Owner",
      email: "demo@queueup.com",
      role: "restaurant_owner",
      createdAt: Date.now(),
    });

    const demoOrgId = await ctx.db.insert("orgs", {
      name: "Demo Restaurant Group",
      ownerUserId: demoUserId,
      plan: "pro",
      createdAt: Date.now(),
    });

    // Create restaurants
    const restaurantIds = [];
    for (const restaurant of melbourneRestaurants) {
      const restaurantId = await ctx.db.insert("restaurants", {
        orgId: demoOrgId,
        ...restaurant,
        settings: {
          smsEnabled: false,
          bufferMins: 10,
          pagingMessage: "Your table is ready! Please return within 10 minutes.",
        },
        isActive: true,
        createdAt: Date.now(),
      });
      restaurantIds.push(restaurantId);
    }

    // Create some waitlists with entries
    for (let i = 0; i < 5; i++) {
      const restaurantId = restaurantIds[i];
      const waitlistId = await ctx.db.insert("waitlists", {
        restaurantId,
        isOpen: true,
        avgWaitMins: 15 + Math.floor(Math.random() * 20),
        createdAt: Date.now(),
      });

      // Add some sample entries
      const sampleEntries = [
        { name: "John Smith", partySize: 2, phone: "+61412345678" },
        { name: "Sarah Johnson", partySize: 4, phone: "+61412345679" },
        { name: "Mike Chen", partySize: 1, phone: "+61412345680" },
        { name: "Emma Wilson", partySize: 3, phone: "+61412345681" },
        { name: "David Brown", partySize: 2, phone: "+61412345682" },
      ];

      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        const entry = sampleEntries[j];
        await ctx.db.insert("waitlistEntries", {
          waitlistId,
          name: entry.name,
          phone: entry.phone,
          partySize: entry.partySize,
          joinSource: "remote",
          joinAt: Date.now() - (j * 10 * 60 * 1000), // 10 minutes apart
          status: "waiting",
          quotedMins: 15 + (j * 5),
          etaMins: 15 + (j * 5),
          position: j + 1,
          shareToken: `demo-token-${i}-${j}`,
          updates: [{
            ts: Date.now() - (j * 10 * 60 * 1000),
            type: "joined",
            meta: { source: "remote" },
          }],
        });
      }
    }

    return { success: true, restaurantsCreated: restaurantIds.length };
  },
});

export const createAdminUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if admin user already exists
    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .first();

    if (existingAdmin) {
      throw new Error("Admin user already exists");
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: "admin",
      createdAt: Date.now(),
    });
  },
});
