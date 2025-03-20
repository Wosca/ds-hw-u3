import { auth } from "@/auth";
import { db } from "@/lib/db";
import { beachDetails, warning } from "@/lib/schema";

interface SuccessResponse {
  success: true;
  error: null;
  count: number;
}

interface FailureResponse {
  success: false;
  error: string;
  count?: null;
}

export type Response = SuccessResponse | FailureResponse;

export const getBeaches = async () => {
  const beaches = await db.select().from(beachDetails);
  return beaches;
};

export const updateNotificationSettings = async (
  formData: FormData
): Promise<Response> => {
  "use server";
  const beaches = formData.getAll("selectedBeaches") as string[];
  console.log(beaches);
  const session = await auth();
  if (!session) {
    return { success: false, error: "Authentication required" };
  }

  const warningRecords = beaches.map((beach) => ({
    email: session.user.email,
    beachID: Number(beach),
  }));

  const result = await db
    .insert(warning)
    .values(warningRecords)
    .onConflictDoNothing({ target: [warning.beachID] })
    .returning({ insertedId: warning.beachID });
  return { success: true, count: result.length, error: null };
};
