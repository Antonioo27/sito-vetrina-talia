import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "~/server/auth/password";

/**
 * Admin-only router for managing users and system settings
 * All procedures require admin authentication
 */
export const adminRouter = createTRPCRouter({
  /**
   * List all users (admin only)
   */
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    // Verify admin
    if (!ctx.session.user.isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can list users",
      });
    }

    console.log(`[ADMIN] 👤 User list requested by ${ctx.session.user.email}`);

    const users = await ctx.db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return users;
  }),

  /**
   * Create a new admin user
   */
  createAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Email invalida"),
        firstName: z.string().min(1, "Nome richiesto"),
        lastName: z.string().min(1, "Cognome richiesto"),
        password: z.string().min(8, "Password deve essere almeno 8 caratteri"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify caller is admin
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create other admins",
        });
      }

      console.log(
        `[ADMIN] 👤 Create admin requested by ${ctx.session.user.email}`
      );

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

      // Create admin
      const admin = await ctx.db.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          password: hashedPassword,
          isAdmin: true,
          emailVerified: new Date(),
        },
      });

      console.log(`[ADMIN] ✅ Admin created: ${admin.email}`);

      return {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        isAdmin: admin.isAdmin,
      };
    }),

  /**
   * Promote a regular user to admin
   */
  promoteToAdmin: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify caller is admin
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can promote users",
        });
      }

      console.log(
        `[ADMIN] 🔝 Promote user requested by ${ctx.session.user.email}`
      );

      // Find user
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Prevent self-demotion
      if (user.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Non puoi modificare il tuo ruolo",
        });
      }

      // Update user
      const updated = await ctx.db.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      });

      console.log(`[ADMIN] ✅ User promoted: ${updated.email}`);

      return {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        isAdmin: updated.isAdmin,
      };
    }),

  /**
   * Demote an admin to regular user
   */
  demoteFromAdmin: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify caller is admin
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can demote users",
        });
      }

      console.log(
        `[ADMIN] 🔽 Demote user requested by ${ctx.session.user.email}`
      );

      // Find user
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Prevent self-demotion
      if (user.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Non puoi modificare il tuo ruolo",
        });
      }

      // Update user
      const updated = await ctx.db.user.update({
        where: { id: user.id },
        data: { isAdmin: false },
      });

      console.log(`[ADMIN] ✅ User demoted: ${updated.email}`);

      return {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        isAdmin: updated.isAdmin,
      };
    }),

  /**
   * Delete a user
   */
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify caller is admin
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete users",
        });
      }

      console.log(
        `[ADMIN] 🗑️  Delete user requested by ${ctx.session.user.email}`
      );

      // Find user
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Prevent self-deletion
      if (user.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Non puoi eliminarti da solo",
        });
      }

      // Delete user
      await ctx.db.user.delete({
        where: { id: user.id },
      });

      console.log(`[ADMIN] ✅ User deleted: ${user.email}`);

      return { id: user.id, email: user.email };
    }),

  /**
   * Reset user password (admin sets new password)
   */
  resetUserPassword: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        newPassword: z
          .string()
          .min(8, "Password deve essere almeno 8 caratteri"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify caller is admin
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can reset passwords",
        });
      }

      console.log(
        `[ADMIN] 🔑 Reset password requested by ${ctx.session.user.email}`
      );

      // Find user
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Hash new password
      const hashedPassword = hashPassword(input.newPassword);

      // Update password
      const updated = await ctx.db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`[ADMIN] ✅ Password reset for: ${updated.email}`);

      return { id: updated.id, email: updated.email };
    }),
});
