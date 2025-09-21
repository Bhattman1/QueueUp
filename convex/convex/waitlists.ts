import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateToken } from "./utils";

export const getWaitlist = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("waitlists")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .first();
  },
});

export const getWaitlistEntries = query({
  args: { waitlistId: v.id("waitlists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("waitlistEntries")
      .withIndex("by_waitlist", (q) => q.eq("waitlistId", args.waitlistId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .order("asc")
      .collect();
  },
});

export const getEntryByShareToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("waitlistEntries")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.shareToken))
      .first();
  },
});

export const joinWaitlist = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    phone: v.optional(v.string()),
    partySize: v.number(),
    source: v.union(v.literal("remote"), v.literal("onsite"), v.literal("staff")),
  },
  handler: async (ctx, args) => {
    // Get or create waitlist
    let waitlist = await ctx.db
      .query("waitlists")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .first();

    if (!waitlist) {
      const waitlistId = await ctx.db.insert("waitlists", {
        restaurantId: args.restaurantId,
        isOpen: true,
        avgWaitMins: 15,
        createdAt: Date.now(),
      });
      waitlist = await ctx.db.get(waitlistId);
    }

    if (!waitlist || !waitlist.isOpen) {
      throw new Error("Waitlist is not open");
    }

    // Get current position
    const existingEntries = await ctx.db
      .query("waitlistEntries")
      .withIndex("by_waitlist", (q) => q.eq("waitlistId", waitlist._id))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .collect();

    const position = existingEntries.length + 1;
    const quotedMins = Math.max(5, 5 + 3 * (position - 1) + Math.min(args.partySize - 1, 6));
    const etaMins = quotedMins;

    const shareToken = generateToken();

    const entryId = await ctx.db.insert("waitlistEntries", {
      waitlistId: waitlist._id,
      name: args.name,
      phone: args.phone,
      partySize: args.partySize,
      joinSource: args.source,
      joinAt: Date.now(),
      status: "waiting",
      quotedMins,
      etaMins,
      position,
      shareToken,
      updates: [{
        ts: Date.now(),
        type: "joined",
        meta: { source: args.source },
      }],
    });

    // Log event
    await ctx.db.insert("events", {
      restaurantId: args.restaurantId,
      entryId,
      type: "entry_join",
      ts: Date.now(),
      meta: { partySize: args.partySize, source: args.source },
    });

    return { entryId, shareToken };
  },
});

export const pageEntry = mutation({
  args: { entryId: v.id("waitlistEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    await ctx.db.patch(args.entryId, {
      status: "paged",
      updates: [
        ...entry.updates,
        {
          ts: Date.now(),
          type: "paged",
          meta: {},
        },
      ],
    });

    // Get restaurantId from waitlist
    const waitlist = await ctx.db.get(entry.waitlistId);
    if (!waitlist) {
      throw new Error("Waitlist not found");
    }

    // Log event
    await ctx.db.insert("events", {
      restaurantId: waitlist.restaurantId,
      entryId: args.entryId,
      type: "entry_paged",
      ts: Date.now(),
    });

    return { success: true };
  },
});

export const seatEntry = mutation({
  args: { entryId: v.id("waitlistEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    await ctx.db.patch(args.entryId, {
      status: "seated",
      updates: [
        ...entry.updates,
        {
          ts: Date.now(),
          type: "seated",
          meta: {},
        },
      ],
    });

    // Get restaurantId from waitlist
    const waitlist = await ctx.db.get(entry.waitlistId);
    if (!waitlist) {
      throw new Error("Waitlist not found");
    }

    // Log event
    await ctx.db.insert("events", {
      restaurantId: waitlist.restaurantId,
      entryId: args.entryId,
      type: "entry_seated",
      ts: Date.now(),
    });

    return { success: true };
  },
});

export const markNoShow = mutation({
  args: { entryId: v.id("waitlistEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    await ctx.db.patch(args.entryId, {
      status: "no_show",
      updates: [
        ...entry.updates,
        {
          ts: Date.now(),
          type: "no_show",
          meta: {},
        },
      ],
    });

    // Get restaurantId from waitlist
    const waitlist = await ctx.db.get(entry.waitlistId);
    if (!waitlist) {
      throw new Error("Waitlist not found");
    }

    // Log event
    await ctx.db.insert("events", {
      restaurantId: waitlist.restaurantId,
      entryId: args.entryId,
      type: "entry_no_show",
      ts: Date.now(),
    });

    return { success: true };
  },
});

export const cancelEntry = mutation({
  args: { entryId: v.id("waitlistEntries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    if (!entry) {
      throw new Error("Entry not found");
    }

    await ctx.db.patch(args.entryId, {
      status: "cancelled",
      updates: [
        ...entry.updates,
        {
          ts: Date.now(),
          type: "cancelled",
          meta: {},
        },
      ],
    });

    // Get restaurantId from waitlist
    const waitlist = await ctx.db.get(entry.waitlistId);
    if (!waitlist) {
      throw new Error("Waitlist not found");
    }

    // Log event
    await ctx.db.insert("events", {
      restaurantId: waitlist.restaurantId,
      entryId: args.entryId,
      type: "entry_cancel",
      ts: Date.now(),
    });

    return { success: true };
  },
});

export const openWaitlist = mutation({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    // Check authorization
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

    const org = await ctx.db.get(restaurant.orgId);
    if (!org || org.ownerUserId !== user._id) {
      throw new Error("Not authorized");
    }

    // Get or create waitlist
    let waitlist = await ctx.db
      .query("waitlists")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .first();

    if (waitlist) {
      await ctx.db.patch(waitlist._id, { isOpen: true });
    } else {
      await ctx.db.insert("waitlists", {
        restaurantId: args.restaurantId,
        isOpen: true,
        avgWaitMins: 15,
        createdAt: Date.now(),
      });
    }

    return { success: true };
  },
});

export const closeWaitlist = mutation({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    // Check authorization
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

    const org = await ctx.db.get(restaurant.orgId);
    if (!org || org.ownerUserId !== user._id) {
      throw new Error("Not authorized");
    }

    const waitlist = await ctx.db
      .query("waitlists")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .first();

    if (waitlist) {
      await ctx.db.patch(waitlist._id, { isOpen: false });
    }

    return { success: true };
  },
});
