// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { username: {}, password: {} },
      async authorize({ username, password }) {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || user.password !== password) return null;
        return { id: user.id, name: user.username, role: user.role };
      },
    }),
  ],

  callbacks: {

    // we have assumed that the google users are by default admins so they will be redirected to admin page
    async redirect({ baseUrl, account }) {
      if (account?.provider === "google") return `${baseUrl}/admin`;
      return `${baseUrl}/`;
    },

    //google user will get the admin role in jwt
    async jwt({ token, user, account }) {
   
      if (account?.provider === "google") token.role = "admin";
      if (user) {
        token.id = user.id ?? token.id;
        token.role = user.role ?? token.role; 
      }
      return token;
    },

    //this will copy the role from the jwt to the session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
