import { auth } from "@/auth";
import { db } from "@/lib/db";
import { beachDetails, warning } from "@/lib/schema";

export const getBeaches = async () => {
  const beaches = await db.select().from(beachDetails);
  return beaches;
};

export const updateNotificationSettings = async (formData: FormData) => {
  "use server";
  console.log(formData);
  const session = await auth();
  if (!session) {
    return;
  }
};
