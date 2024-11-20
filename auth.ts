import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const tempUsername = credentials.username;
        if (!tempUsername) {
          console.log(credentials.email, credentials.password);
          try {
            if (
              credentials.email === "Wosca@gmail.com" &&
              credentials.password === "12345"
            ) {
              return { id: "1", username: "Wosca", email: "Wosca@gmail.com" };
            } else {
              throw new Error("Invalid credentials");
            }
            return null;
          } catch (error) {
            throw error;
          }
        } else {
          const { username, email, password } = await signInSchema.parseAsync(
            credentials
          );
          try {
            if (
              username === "Wosca" &&
              email === "Wosca@gmail.com" &&
              password === "123"
            ) {
              return { id: "1", username: "Wosca", email: "Wosca@gmail.com" };
            }
            return null;
          } catch (error) {
            if (error instanceof ZodError) {
              throw error; // Throw the validation error for the client to handle
            }
            throw new Error("Unexpected error"); // Generic error fallback
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add role to JWT token
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
  },
});
