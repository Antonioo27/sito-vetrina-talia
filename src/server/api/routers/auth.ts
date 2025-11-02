import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hashPassword } from "~/server/auth/password";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "Nome richiesto"),
        lastName: z.string().min(1, "Cognome richiesto"),
        email: z.string().email("Email non valida"),
        password: z
          .string()
          .min(8, "Password deve avere almeno 8 caratteri"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Un utente con questa email esiste già",
        });
      }

      // Hash password
      const hashedPassword = hashPassword(input.password);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: hashedPassword,
          isAdmin: false,
        },
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }),
});
