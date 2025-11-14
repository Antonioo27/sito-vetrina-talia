import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const wishlistRouter = createTRPCRouter({
  // Get all wishlist items for the current user (con media per la pagina wishlist)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.wishlist.findMany({
      where: { userId: ctx.session.user.id! },
      include: {
        product: {
          include: {
            media: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Ottimizzato: Query solo per conteggio wishlist (usato nella navbar)
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.wishlist.count({
      where: { userId: ctx.session.user.id! },
    });
    return count;
  }),

  // Check if a product is in wishlist
  isInWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: ctx.session.user.id!,
            productId: input.productId,
          },
        },
      });
      return !!item;
    }),

  // Add product to wishlist
  add: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.wishlist.create({
          data: {
            userId: ctx.session.user.id!,
            productId: input.productId,
          },
          include: {
            product: {
              include: {
                media: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        });
      } catch (error) {
        // If it already exists, just return it
        return await ctx.db.wishlist.findUnique({
          where: {
            userId_productId: {
              userId: ctx.session.user.id!,
              productId: input.productId,
            },
          },
          include: {
            product: {
              include: {
                media: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        });
      }
    }),

  // Remove product from wishlist
  remove: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.wishlist.delete({
        where: {
          userId_productId: {
            userId: ctx.session.user.id!,
            productId: input.productId,
          },
        },
      });
    }),
});
