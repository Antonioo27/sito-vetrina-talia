import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { db } from "~/server/db";
import { verifyPassword } from "./password";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing email or password");
          return null;
        }

        console.log(`[AUTH] Login attempt for: ${credentials.email}`);

        // Find user
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log(`[AUTH] ❌ User not found: ${credentials.email}`);
          return null;
        }

        console.log(`[AUTH] 👤 User found: ${user.email}, isAdmin: ${user.isAdmin}`);

        // Check password hash exists
        if (!user.password) {
          console.log(`[AUTH] ❌ User has no password hash: ${credentials.email}`);
          return null;
        }

        // Verify password
        const isPasswordValid = verifyPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          console.log(`[AUTH] ❌ Password mismatch for: ${credentials.email}`);
          return null;
        }

        console.log(`[AUTH] ✅ Authentication successful for: ${credentials.email}`);

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      console.log("[JWT] Building token:", { userId: user?.id, hasUser: !!user });

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isAdmin = user.isAdmin;

        console.log("[JWT] Token populated:", {
          id: token.id,
          email: token.email,
          isAdmin: token.isAdmin,
        });
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log("[SESSION] Building session from token:", {
        tokenId: token.id,
        tokenEmail: token.email,
        tokenIsAdmin: token.isAdmin,
        sessionUserEmail: session.user?.email,
      });

      // Ensure we have at least id in token
      if (!token.id) {
        console.log("[SESSION] ❌ No token.id, returning default session");
        return session;
      }

      // Build the user object from token
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: (token.email as string) || session.user?.email,
          firstName: (token.firstName as string) || undefined,
          lastName: (token.lastName as string) || undefined,
          isAdmin: (token.isAdmin as boolean) || false,
        },
      };

      console.log("[SESSION] ✅ Session built:", {
        email: updatedSession.user.email,
        isAdmin: updatedSession.user.isAdmin,
      });

      return updatedSession;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("[EVENT] User signed in:", {
        id: user.id,
        email: user.email,
        isAdmin: (user as any).isAdmin,
      });
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
} satisfies NextAuthConfig;
