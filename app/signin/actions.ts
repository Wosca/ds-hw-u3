"use server";

import { signIn } from "@/auth";

export async function SignIn1({
  email,
  password,
}: {
  email: string;

  password: string;
}) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return true;
  } catch (error: unknown) {
    console.error(error?.toString());
    return error;
  }
}
