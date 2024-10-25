// next-auth.d.ts

{/*

Now, the extended fields (id, role, phoneNumber, location, balance, creditCards) should be recognized in session.user, resolving your TypeScript error. Let me know if this works for your case!

*/}

// next-auth.d.ts
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      phoneNumber?: string | null;
      image?: string | null;
      location?: string | null;
      provider: string;
      createdAt: Date;
      updatedAt: Date;
      balance: number;
      isBanned: boolean;
      isVerified: boolean;
      creditCards: UserCreditCard[];
      transactions: Transaction[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phoneNumber?: string | null;
    location?: string | null;
    balance: number;
    isBanned: boolean;
    isVerified: boolean;
    creditCards: UserCreditCard[];
    transactions: Transaction[];
  }
}
