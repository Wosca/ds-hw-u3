import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "./profile-form";
import { db } from "@/lib/db";
import { userDetails } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Server action to update user profile
async function updateProfile(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session || !session.user) {
    return { success: false, error: "Authentication required" };
  }

  const firstName = formData.get("firstName") as string;
  const surname = formData.get("surname") as string;

  // Validate input
  if (!firstName || !surname) {
    return { success: false, error: "First name and surname are required" };
  }

  try {
    // Update user in the database
    const result = await db
      .update(userDetails)
      .set({
        firstName,
        surname,
      })
      .where(eq(userDetails.email, session.user.email))
      .returning({
        firstName: userDetails.firstName,
        surname: userDetails.surname,
        email: userDetails.email,
        accessLevel: userDetails.accessLevel,
      });

    if (result.length === 0) {
      return { success: false, error: "User not found" };
    }

    // Revalidate the current path to refresh server components
    revalidatePath("/profile");
    return { success: true, user: result[0] };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            user={session.user}
            updateProfileAction={updateProfile}
          />
        </CardContent>
      </Card>
    </div>
  );
}
