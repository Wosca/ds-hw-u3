"use server";

import { signIn } from "@/auth";

export async function SignUp({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  try {
    await signIn("credentials", {
      email,
      password,
      username,
      redirect: false,
    });
  } catch (error: any) {
    return JSON.parse(error.cause.err);
  }
}
