import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FortyTwoProvider from "next-auth/providers/42-school";
import { prisma } from "./prisma";
import bcrypt from 'bcrypt';

interface ExtendedSession extends Session {
	user: {
		id: string;
		role: string;
		email?: string | null;
		name?: string | null;
		image?: string | null;
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
			  // Check if email and password are provided
			  if (!credentials?.email || !credentials?.password) {
				throw new Error("Missing email or password");
			  }
	  
			  // Find the user in the database
			  const user = await prisma.user.findUnique({
				where: { email: credentials.email },
			  });
	  
			  if (!user) {
				throw new Error("No user found with this email");
			  }
	  
			  // Validate the password (implement your password validation logic)
			//   console.log("Credentials:", user);
			  const isValid = await validatePassword(credentials.password, user.password);
			  if (!isValid) {
				throw new Error("Invalid password");
			  }
	  
			  // Return user object
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
	callbacks: {
		async signIn({ user, account }) {
			// console.log("User object in signIn:", user);
			// console.log("Account object in signIn:", account);//data from the provider

			async function fetchGoogleUserImage(accessToken: string) {//Fuck khasna njibo ga3 dik data 3awd w ls9ojdha hna tfo
				const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const data = await response.json();
				return data.picture; // This is where the image URL is located
			}
			async function fetch42UserImage(accessToken: string) {//Fuck khasna njibo ga3 dik data 3awd w ls9ojdha hna tfo
				const response = await fetch('https://api.intra.42.fr/v2/me', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const data = await response.json();
				return data.image.link; // This is where the image URL is located
			}

			try {
				const { email, name } = user;

				// Type guard to ensure email is a string
				if (typeof email !== 'string') {
					throw new Error("Email is not valid.");
				}

				let image = user.image;
				if (!image) {
					if (account?.provider === 'google') {
						image = await fetchGoogleUserImage(account.access_token!);
					} else if (account?.provider === '42-school') {
						image = await fetch42UserImage(account.access_token!);
					}
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
							name: name || "Unknown User",
							password: "", // Leave password empty for OAuth users
							role: "user",
							provider: provider || "email", // Store the provider name
							city: null,
							country: null,
							image: image,
							phoneNumber: "",
						},
					});
					console.log("User added to the database.");
				} else {
					console.log("User already exists.");
				}

				// Continue with the sign-in process
				return true;
			} catch (error) {
				console.error("Error in signIn callback:", error);
				return false;
			}
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			// Fetch additional data from your database
			const dbUser = await prisma.user.findUnique({
				where: { email: session.user?.email as string },
			});

			if (dbUser) {
				// Type assertion to extend session
				const extendedSession = session as ExtendedSession;

				// Add custom properties to the session object
				extendedSession.user.id = dbUser.id;
				extendedSession.user.role = dbUser.role;
				extendedSession.user.email = dbUser.email;
				extendedSession.user.name = dbUser.name;
				extendedSession.user.image = dbUser.image || '';

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