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

interface UserCreditCard {
	id: string;
	number: string;
	expirationDate: Date;
	cvv: string;
	holder: string;
	isBlocked: boolean;
}


interface ExtendedSession extends Session {
	user: {
		id: string;
		role: string;
		email?: string | null;
		name?: string | null;
		image?: string | null;
		phoneNumber?: string | null;
		location?: string | null;
		balance?: number;
		transactions?: string[];
		creditCards?: UserCreditCard[];
	};
}

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
			  };
			},
		  }),
	],
	// adapter: PrismaAdapter(prisma),
	callbacks: {
		async signIn({ user, account }) {
			try {
				const { email } = user;
				if (typeof email !== 'string') {
					throw new Error("Email is not valid.");
				}

				const existingUser = await prisma.user.findUnique({
					where: { email },
				});

				
				if (existingUser) {
					console.log("User found with this email\n");
					throw new Error("User already registered");
				} else {
					console.log("Creating User in the database:", existingUser);
					const newUser = await prisma.user.create({
						data: {
							email: email,
							name: user?.name || "Unknown User",
							password: "",
							role: "user",
							provider: account?.provider || "email",
							image: user?.image,
							phoneNumber: "",
							location: "Unknown Location",
							balance: 0,
						},
					});
					console.log("User added to the database.");

					const todayDate = new Date();
					const newCardNumber = generateCreditCardNumber("421337");
					const creditCard = await prisma.creditCard.create({
						data: {
							ownerId: newUser.id,
							isBlocked: false,
							holder: newUser.name,
							number: newCardNumber,//need to check if its already in the database
							expirationDate: new Date().setFullYear(todayDate.getFullYear() + 10).toString(),
							cvv: `${newCardNumber[6]}${newCardNumber[8]}${newCardNumber[10]}`,
						},
					});

					console.log("Credit card added to the database.");
					//link the credit card to the user

					await prisma.user.update({
						where: { id: newUser.id },
						data: {
							creditCards: {
								connect: {
									id: creditCard.id,
								},
							},
						},
					});

				}

				return true;
			} catch (error) {
				console.error("Error in signIn callback:", error);
				return false;
			}
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			const dbUser = await prisma.user.findUnique({
				where: { email: session.user?.email as string },
				include: { creditCards: true },
			});

			if (dbUser) {
				const extendedSession = session as ExtendedSession;
				extendedSession.user.id = dbUser.id;
				extendedSession.user.role = dbUser.role;
				extendedSession.user.email = dbUser.email;
				extendedSession.user.name = dbUser.name;
				extendedSession.user.image = dbUser.image || '';
				extendedSession.user.phoneNumber = dbUser.phoneNumber || '';
				extendedSession.user.location = dbUser.location || '';
				extendedSession.user.balance = dbUser.balance;
				dbUser.creditCards.length > 0 ? extendedSession.user.creditCards = dbUser.creditCards : extendedSession.user.creditCards = [];
			
				console.log("Extended session:", extendedSession);
				return extendedSession;
			}
			

			return session;
		},
	},
};

async function validatePassword(plainTextPassword: string, hashedPassword: string) {
	return bcrypt.compare(plainTextPassword, hashedPassword);
}
