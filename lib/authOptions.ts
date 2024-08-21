import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42-school";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    FortyTwoProvider({
      clientId: process.env.FORTYTWO_ID as string,
      clientSecret: process.env.FORTYTWO_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const { email, name, image } = user;

        // Type guard to ensure email is a string
        if (typeof email !== 'string') {
          throw new Error("Email is not valid.");
        }

        // Determine the provider
        const provider = account?.provider; // e.g., "github", "google", "42-school"

        // Check if the user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          // If the user doesn't exist, add them to the database
          await prisma.user.create({
            data: {
              email: email,
              name: name || "Unknown User", // Set a default name if name is null or undefined
              password: "", // Leave password empty for OAuth users
              role: "user",
              provider: provider, // Store the provider name
              city: null,
              country: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          console.log("User added to the database.");   
        }
        else
            console.log("User already exist.");   

        // Continue with the sign-in process
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
};
