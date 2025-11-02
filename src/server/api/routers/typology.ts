import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const typologyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.typology.findMany({
      orderBy: { name: "asc" },
    });
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1, "Il nome è obbligatorio") }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.isAdmin) {
        throw new Error("Non autorizzato");
      }

      // Check if typology already exists
      const existing = await ctx.db.typology.findUnique({
        where: { name: input.name },
      });

      if (existing) {
        throw new Error("Questa tipologia esiste già");
      }

      return ctx.db.typology.create({
        data: { name: input.name },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.isAdmin) {
        throw new Error("Non autorizzato");
      }

      return ctx.db.typology.delete({
        where: { name: input.name },
      });
    }),
});
