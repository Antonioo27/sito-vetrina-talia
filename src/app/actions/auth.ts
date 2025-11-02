"use server";

import { db } from "~/server/db";

/**
 * Check if a user is admin (server action)
 * This is used as a fallback when NextAuth doesn't populate session data correctly
 */
export async function checkUserIsAdmin(email: string): Promise<boolean> {
  try {
    console.log("[SERVER ACTION] Checking if admin:", email);

    const user = await db.user.findUnique({
      where: { email },
      select: { isAdmin: true },
    });

    const isAdmin = user?.isAdmin ?? false;

    console.log("[SERVER ACTION] Admin check result:", { email, isAdmin });

    return isAdmin;
  } catch (error) {
    console.error("[SERVER ACTION] Error checking admin status:", error);
    return false;
  }
}
