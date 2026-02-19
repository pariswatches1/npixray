/**
 * NextAuth v5 configuration — Google OAuth with Neon PostgreSQL.
 *
 * Stores users in the `users` table. JWT-based sessions encode
 * the user's plan and subscription status for fast access.
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// ── User DB helpers ────────────────────────────────────────

async function getNeon() {
  const { neon } = await import("@neondatabase/serverless");
  return neon(process.env.DATABASE_URL!);
}

function generateId(): string {
  return crypto.randomUUID();
}

async function findUserByEmail(email: string) {
  if (!process.env.DATABASE_URL) return null;
  const sql = await getNeon();
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return rows.length > 0 ? rows[0] : null;
}

async function createUser(profile: {
  email: string;
  name: string;
  image: string;
}) {
  if (!process.env.DATABASE_URL) return { id: "local", ...profile, plan: "free", subscription_status: "none" };
  const sql = await getNeon();
  const id = generateId();
  await sql`
    INSERT INTO users (id, email, name, image, provider, plan, subscription_status)
    VALUES (${id}, ${profile.email}, ${profile.name}, ${profile.image}, 'google', 'free', 'none')
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      image = EXCLUDED.image,
      updated_at = NOW()
  `;
  return { id, ...profile, plan: "free", subscription_status: "none" };
}

async function getUserById(id: string) {
  if (!process.env.DATABASE_URL) return null;
  const sql = await getNeon();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows.length > 0 ? rows[0] : null;
}

// ── NextAuth config ────────────────────────────────────────

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  trustHost: true,

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await findUserByEmail(user.email);
        if (existing) {
          // Update existing user
          user.id = existing.id;
        } else {
          // Create new user
          const created = await createUser({
            email: user.email,
            name: user.name || "",
            image: user.image || "",
          });
          user.id = created.id;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // On initial sign-in, set user data
      if (user?.email) {
        const dbUser = await findUserByEmail(user.email);
        if (dbUser) {
          token.userId = dbUser.id;
          token.plan = dbUser.plan || "free";
          token.subscriptionStatus = dbUser.subscription_status || "none";
          token.npi = dbUser.npi || null;
        }
      }

      // On session update (e.g., after plan change), refresh from DB
      if (trigger === "update" && token.userId) {
        const dbUser = await getUserById(token.userId as string);
        if (dbUser) {
          token.plan = dbUser.plan || "free";
          token.subscriptionStatus = dbUser.subscription_status || "none";
          token.npi = dbUser.npi || null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        (session.user as any).plan = token.plan as string;
        (session.user as any).subscriptionStatus = token.subscriptionStatus as string;
        (session.user as any).npi = token.npi as string | null;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
