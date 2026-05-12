import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
        token.firstAccess = user.firstAccess;
        token.createdAt = user.createdAt;
      }
      if (trigger === "update" && session?.firstAccess !== undefined) {
        token.firstAccess = session.firstAccess;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
        session.user.firstAccess = token.firstAccess as boolean;
        session.user.createdAt = token.createdAt as Date;
      }
      return session;
    }
  }
} satisfies NextAuthConfig
