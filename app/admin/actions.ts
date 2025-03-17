"use server";

import { db } from "@/lib/db"; // your configured Drizzle instance
import { userDetails } from "@/lib/schema";
import { updateUserSchema } from "@/lib/zod";
import { eq } from "drizzle-orm";

// This function fetches all users
export async function getUsers() {
  return await db.select().from(userDetails);
}

// This server action accepts a form submission to update a user.
export async function updateUser(formData: FormData) {
  "use server";

  const parsedData = {
    email: formData.get("email")?.toString(),
    firstName: formData.get("firstName")?.toString(),
    surname: formData.get("surname")?.toString(),
    accessLevel: Number(formData.get("accessLevel")?.toString()),
  };

  const result = await updateUserSchema.safeParseAsync(parsedData);
  if (!result.success) {
    console.log(result.error.issues);
    return { success: false, error: result.error.issues };
  }
  const { email, firstName, surname, accessLevel } = result.data;
  await db
    .update(userDetails)
    .set({ firstName, surname, accessLevel: Number(accessLevel) })
    .where(eq(userDetails.email, email));

  return { success: true, error: null };
}

export async function deleteUser(email: string) {
  "use server";

  if (!email) {
    throw new Error("Missing required fields.");
  }

  await db.delete(userDetails).where(eq(userDetails.email, email));

  // Optionally, you can trigger revalidation here.
  return;
}
