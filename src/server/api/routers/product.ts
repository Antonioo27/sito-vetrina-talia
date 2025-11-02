import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Schema for product input validation
const productInputSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  discount: z.number().min(0).max(100).optional(),
  imageUrl: z.string().optional(),
  typology: z.string().optional(),
  weight: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
});

// Schema for product with media
const productWithMediaSchema = productInputSchema.extend({
  mediaUrls: z.array(z.string()).optional(), // Array of base64 or URLs
});

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        media: {
          orderBy: { order: "asc" },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          media: {
            orderBy: { order: "asc" },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(productWithMediaSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.isAdmin) {
        throw new Error("Non autorizzato");
      }

      const { mediaUrls, ...productData } = input;

      // Create product with media
      return ctx.db.product.create({
        data: {
          ...productData,
          media: mediaUrls
            ? {
                create: mediaUrls.map((url, index) => ({
                  type: "image",
                  url,
                  order: index,
                })),
              }
            : undefined,
        },
        include: {
          media: {
            orderBy: { order: "asc" },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: productWithMediaSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.isAdmin) {
        throw new Error("Non autorizzato");
      }

      const { mediaUrls, ...productData } = input.data;

      // Update product and media
      return ctx.db.product.update({
        where: { id: input.id },
        data: {
          ...productData,
          // Delete all old media and create new ones
          media: mediaUrls
            ? {
                deleteMany: {}, // Delete all existing media
                create: mediaUrls.map((url, index) => ({
                  type: "image",
                  url,
                  order: index,
                })),
              }
            : undefined,
        },
        include: {
          media: {
            orderBy: { order: "asc" },
          },
        },
      });
    }),

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

      return ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});
