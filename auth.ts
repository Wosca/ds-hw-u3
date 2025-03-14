import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { db } from "./lib/db";
import { userDetails } from "./lib/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const compareHashPassword = (password: string, hashedPassword: string) => {
  if (hashPassword(password) === hashedPassword) {
    return { success: true, message: "Password matched" };
  }
  return { success: false, message: "Password not matched" };
};

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text" },
        surname: { label: "Surname", type: "text" },
      },
      authorize: async (credentials) => {
        // Validate the provided credentials using Zod.
        const { email, password } = await signInSchema.parseAsync(credentials);

        // Query the database for the user by email.
        const dbUser = await db
          .select()
          .from(userDetails)
          .where(eq(userDetails.email, email))
          .limit(1);

        if (dbUser.length === 0) {
          const user = await db
            .insert(userDetails)
            .values({
              email: email,
              firstName: credentials.firstName,
              surname: credentials.surname,
              password: hashPassword(password),
            })
            .returning();
          return {
            firstName: user[0].firstName,
            surname: user[0].surname,
            email: user[0].email,
            accessLevel: user[0].accessLevel,
          };
        }

        // Verify the provided password against the stored hash.
        const isValid = await compareHashPassword(password, dbUser[0].password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Return user object with details from the database.
        return {
          firstName: dbUser[0].firstName,
          surname: dbUser[0].surname,
          email: dbUser[0].email,
          accessLevel: dbUser[0].accessLevel,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        firstName: token.firstName as string,
        surname: token.surname as string,
        email: token.email as string,
        accessLevel: Number(token.accessLevel),
      };
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.firstName = user.firstName;
        token.surname = user.surname;
        token.email = user.email;
        token.accessLevel = user.accessLevel;
      }
      if (trigger === "update") {
        token = {
          ...token,
          firstName: session.user.firstName,
          surname: session.user.surname,
          email: session.user.email,
          accessLevel: session.user.accessLevel,
        };
      }
      return token;
    },
  },
});
