import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eya.local";
const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
const brokerEmail = process.env.BROKER_EMAIL ?? "broker@eya.local";
const brokerPassword = process.env.BROKER_PASSWORD ?? "ChangeMe123!";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-not-for-production",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return { id: "admin-1", email: adminEmail, name: "EYA Admin", role: "admin" };
        }

        if (
          credentials.email === brokerEmail &&
          credentials.password === brokerPassword
        ) {
          return { id: "broker-1", email: brokerEmail, name: "EYA Broker", role: "broker" };
        }

        return {
          id: "member-1",
          email: credentials.email,
          name: credentials.email.split("@")[0],
          role: "member",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "member";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? "member";
      }
      return session;
    },
  },
};
