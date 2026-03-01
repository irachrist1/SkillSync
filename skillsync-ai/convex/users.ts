import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateUser = mutation({
  args: {
    deviceId: v.string(),
    locale: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSeenAt: now,
        locale: args.locale ?? existing.locale,
        timezone: args.timezone ?? existing.timezone,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      deviceId: args.deviceId,
      locale: args.locale ?? "en-RW",
      timezone: args.timezone ?? "Africa/Kigali",
      createdAt: now,
      lastSeenAt: now,
    });
  },
});

export const getUserByDevice = query({
  args: { deviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", args.deviceId))
      .first();
  },
});
