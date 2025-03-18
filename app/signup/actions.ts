"use server";

import { signIn } from "@/auth";

export async function SignUp1({
  email,
  password,
  firstName,
  surname,
}: {
  email: string;
  password: string;
  firstName: string;
  surname: string;
}) {
  try {
    await signIn("credentials", {
      email,
      password,
      firstName,
      surname,
      redirect: false,
    });
    return true;
  } catch (error: unknown) {
    console.error(error?.toString());
    return error;
  }
}
