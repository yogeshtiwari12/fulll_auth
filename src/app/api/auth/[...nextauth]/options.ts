import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "../../route";
import User from "../../model/route";
import bcrypt from "bcryptjs";
import { error } from "console";
import { secureHeapUsed } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },

      },
      async authorize(credentials: any): Promise<any> {
        await connectDb();
        try {
          const user = await User.findOne({
            $or: [{ email: credentials.email }, { name: credentials.name }],
          });
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isverified) {
            throw new Error("Verify your account first");
          }

          const ispasswordmatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!ispasswordmatch) {
            throw new Error("Invalid password");
          } else {

            return user;
            
          }
        } catch (error) {
          console.error("Error in authorize:", error);
          throw new Error(
            `Authorization failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); 
    }
    return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id ;
        session.user.name = token.name ;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    newUser: "/sign-up", // Will disable the new account creation screen
  },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
};
