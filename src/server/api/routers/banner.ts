import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const bannerRouter = createTRPCRouter({
  // Public endpoint to get the active banner
  getActive: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.banner.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Admin endpoint to get all banners
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user?.isAdmin) {
      throw new Error("Non autorizzato");
    }

    return ctx.db.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // Admin endpoint to create/update banner
  upsert: protectedProcedure
    .input(z.object({
      imageUrl: z.string().min(1, "L'URL dell'immagine è obbligatorio"),
      altText: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.isAdmin) {
        throw new Error("Non autorizzato");
      }

      // Deactivate all existing banners
      await ctx.db.banner.updateMany({
        where: { active: true },
        data: { active: false },
      });

      // Create new active banner
      return ctx.db.banner.create({
        data: {
          imageUrl: input.imageUrl,
          altText: input.altText,
          active: true,
        },
      });
    }),

  // Admin endpoint to delete a banner
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.isAdmin) {
        throw new Error("Non autorizzato");
      }

      return ctx.db.banner.delete({
        where: { id: input.id },
      });
    }),
});
