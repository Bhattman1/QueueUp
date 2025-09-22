import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("restaurant_owner"), v.literal("customer")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  orgs: defineTable({
    name: v.string(),
    ownerUserId: v.id("users"),
    plan: v.union(v.literal("basic"), v.literal("pro"), v.literal("premium")),
    createdAt: v.number(),
  }).index("by_owner", ["ownerUserId"]),

  restaurants: defineTable({
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
      day: v.number(), // 0-6 (Sunday-Saturday)
      open: v.string(), // "11:00"
      close: v.string(), // "22:00"
    })),
    photos: v.array(v.string()),
    settings: v.object({
      smsEnabled: v.boolean(),
      bufferMins: v.number(),
      pagingMessage: v.string(),
    }),
    isActive: v.optional(v.boolean()), // Admin can deactivate restaurants
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_org", ["orgId"])
    .index("by_geo", ["geo.lat", "geo.lng"])
    .index("by_active", ["isActive"]),

  waitlists: defineTable({
    restaurantId: v.id("restaurants"),
    isOpen: v.boolean(),
    avgWaitMins: v.number(),
    createdAt: v.number(),
  }).index("by_restaurant", ["restaurantId"]),

  waitlistEntries: defineTable({
    waitlistId: v.id("waitlists"),
    name: v.string(),
    phone: v.optional(v.string()),
    partySize: v.number(),
    joinSource: v.union(v.literal("remote"), v.literal("onsite"), v.literal("staff")),
    joinAt: v.number(),
    status: v.union(
      v.literal("waiting"),
      v.literal("paged"),
      v.literal("seated"),
      v.literal("no_show"),
      v.literal("cancelled")
    ),
    quotedMins: v.number(),
    etaMins: v.number(),
    position: v.number(),
    shareToken: v.string(),
    notes: v.optional(v.string()),
    updates: v.array(v.object({
      ts: v.number(),
      type: v.string(),
      meta: v.optional(v.any()),
    })),
  })
    .index("by_waitlist", ["waitlistId"])
    .index("by_share_token", ["shareToken"])
    .index("by_status", ["status"])
    .index("by_position", ["position"]),

  events: defineTable({
    restaurantId: v.id("restaurants"),
    entryId: v.optional(v.id("waitlistEntries")),
    type: v.union(
      v.literal("entry_join"),
      v.literal("entry_cancel"),
      v.literal("entry_paged"),
      v.literal("entry_seated"),
      v.literal("entry_no_show"),
      v.literal("quote_update"),
      v.literal("eta_update")
    ),
    ts: v.number(),
    meta: v.optional(v.any()),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_entry", ["entryId"])
    .index("by_type", ["type"])
    .index("by_timestamp", ["ts"]),
});
