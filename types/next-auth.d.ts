// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the default session interface
declare module "next-auth" {
  interface Session {
    user: {
      firstName: string;
      surname: string;
      email: string;
      accessLevel: number;
    } & DefaultSession["user"];
  }

  interface User {
    firstName: string;
    surname: string;
    email: string;
    accessLevel: number;
  }
}

// Extend the default JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    firstName: string;
    surname: string;
    email: string;
    accessLevel: number;
  }
}
