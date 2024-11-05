import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FortyTwoProvider from "next-auth/providers/42-school";
import { prisma } from "./prisma";
import bcrypt from 'bcrypt';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import generateCreditCardNumber from "@/app/api/algorithms/luhn";

//TODO:need to add signout functionality

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
		CredentialsProvider({
			name: "Credentials",
			credentials: {
			  email: { label: "Email", type: "text" },
			  password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
			  if (!credentials?.email || !credentials?.password) {
				throw new Error("Missing email or password");
			  }
	  
			  const user = await prisma.user.findUnique({
				where: { email: credentials.email },
				include: { creditCards: true , sentTransactions: true, receivedTransactions: true},
			  });
	  
			  if (!user) {
				throw new Error("No user found with this email");
			  }
	  
			  const isValid = await validatePassword(credentials.password, user.password);
			  if (!isValid) {
				throw new Error("Invalid password");
			  }
	  
			  return {
				id: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
				role: user.role,
				phoneNumber: user.phoneNumber,
				location: user.location,
				provider: user.provider,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				balance: user.balance,
				isBanned: user.isBanned,
				isVerified: user.isVerified,
				creditCards: user.creditCards,
				transactions: [user.sentTransactions, user.receivedTransactions],
			  };
			},
		  }),
		],
		// adapter: PrismaAdapter(prisma),
		callbacks: {
			//should register the users in the database if they don't exist meannign they came from  either github, google or 42
			async signIn({ user, account, profile }) {
				let email, name, image;
    			if (account?.provider === 'credentials') {
    			  // Assign user properties from credentials-based login
    			  email = user.email;
    			  name = user.name;
    			  image = user.image;
    			} else {
    			  // Assign properties for OAuth providers
    			  email = profile?.email;
    			  name = profile?.name || profile?.displayname; // Default for 42
    			  image = profile?.image?.link || profile?.image || user.image;
    			}
				const userExists = await prisma.user.findUnique({
					where: { email: email as string },
				});
	
				if (!userExists) {
	
					let imageLink, DisplayName;
					// For 42 provider, handle image as an object with links
					if (account?.provider === "42-school" && typeof profile?.image === 'object' && profile?.image?.link) {
						DisplayName = profile?.displayname;
						imageLink = profile?.image.link;  // Primary image link for 42
					} else {
						imageLink = profile?.image as string;  // Standard image for other providers
					}
					await prisma.user.create({
						data: {
							email: email as string,
							name: DisplayName || name as string,
							image: imageLink,
							provider: account?.provider as string,
							role: "USER",
							isVerified: false,
							isBanned: false,
							balance: 0,
							password: "",
							location: "",
							phoneNumber: "",
							gender: "",
							DataSubmitted: false,
							phoneNumberVerified: false,
						},
					});
				}
				return true;
			},
			async jwt({ token, user }) {
			// When the user signs in for the first time, add additional properties to the token
			if (user) {
				const dbUser = await prisma.user.findUnique({
					where: { email: user.email as string },
					include: { creditCards: true },
				});

				if (dbUser) {
					token.id = dbUser.id;
					token.role = dbUser.role;
					token.phoneNumber = dbUser.phoneNumber;
					token.location = dbUser.location;
					token.balance = dbUser.balance;
					// token.isBanned = dbUser.isBanned;
					token.isVerified = dbUser.isVerified;
					token.image = dbUser.image;
					token.provider = dbUser.provider;
					token.phoneNumberVerified = dbUser.phoneNumberVerified;
					token.DataSubmitted = dbUser.DataSubmitted;
					token.gender = dbUser.gender;
				}
			}
			return token;
		},
	
		async session({ session, token }) {
			const dbUser = await prisma.user.findUnique({
			  where: { email: session.user?.email as string },
			  include: { creditCards: true, sentTransactions: true, receivedTransactions: true },
			});
		  
			if (dbUser) {
				session.user = {
					id: dbUser.id,
					name: dbUser.name,
					email: dbUser.email,
					role: dbUser.role,
					phoneNumber: dbUser.phoneNumber,
					image: dbUser.image,
					location: dbUser.location,
					provider: dbUser.provider,
					createdAt: dbUser.createdAt,
					updatedAt: dbUser.updatedAt,
					balance: dbUser.balance,
					isBanned: dbUser.isBanned,
					isVerified: dbUser.isVerified,
					creditCards: dbUser.creditCards,
					transactions: [ dbUser.sentTransactions, dbUser.receivedTransactions ],
					phoneNumberVerified: dbUser.phoneNumberVerified,
					DataSubmitted: dbUser.DataSubmitted,
					gender: dbUser.gender,
				};
			}
			return session;
		  },

		  
		  
	},	
};

async function validatePassword(plainTextPassword: string, hashedPassword: string) {
	return bcrypt.compare(plainTextPassword, hashedPassword);
}
