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
		phoneNumber?: string | null;
		location?: string | null;
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
	callbacks: {
		async signIn({ user, account }) {
			async function fetchGoogleUserData(accessToken: string) {
				const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const data = await response.json();
				return {
					image: data.picture,
					name: data.name,
					email: data.email,
					phoneNumber: data.phone_number,
					location: data.locale, // Google doesn't provide an exact location, but locale can be used as a proxy
				};
			}

			async function fetch42UserData(accessToken: string) {
				const response = await fetch('https://api.intra.42.fr/v2/me', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const data = await response.json();
				return {
					image: data.image.link,
					name: data.displayname,
					email: data.email,
					phoneNumber: data.phone,
					location: data.location,
				};
			}

			async function fetchGithubUserData(accessToken: string) {
				const response = await fetch('https://api.github.com/user', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const data = await response.json();
				return {
					image: data.avatar_url,
					name: data.name,
					email: data.email,
					phoneNumber: null, // GitHub API does not provide phone numbers
					location: data.location,
				};
			}

			try {
				const { email } = user;
				if (typeof email !== 'string') {
					throw new Error("Email is not valid.");
				}

				let userData;
				if (account?.provider === 'google') {
					userData = await fetchGoogleUserData(account.access_token!);
				} else if (account?.provider === '42-school') {
					userData = await fetch42UserData(account.access_token!);
				} else if (account?.provider === 'github') {
					userData = await fetchGithubUserData(account.access_token!);
				}

				const existingUser = await prisma.user.findUnique({
					where: { email },
				});

				if (!existingUser) {
					await prisma.user.create({
						data: {
							email: userData?.email,
							name: userData?.name || "Unknown User",
							password: "",
							role: "user",
							provider: account?.provider || "email",
							city: null,
							country: null,
							image: userData?.image,
							phoneNumber: userData?.phoneNumber || "",
							// location: userData?.location || "",
						},
					});
					console.log("User added to the database.");
				} else {
					console.log("User already exists.\n", userData);
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
			});

			if (dbUser) {
				const extendedSession = session as ExtendedSession;
				extendedSession.user.id = dbUser.id;
				extendedSession.user.role = dbUser.role;
				extendedSession.user.email = dbUser.email;
				extendedSession.user.name = dbUser.name;
				extendedSession.user.image = dbUser.image || '';
				extendedSession.user.phoneNumber = dbUser.phoneNumber || '';
				// extendedSession.user.location = dbUser.location || '';

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
