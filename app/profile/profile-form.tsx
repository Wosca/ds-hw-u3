"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

type User = {
  firstName: string;
  surname: string;
  email: string;
  accessLevel: number;
};

type ProfileFormProps = {
  user: User;
  updateProfileAction: (formData: FormData) => Promise<{
    success: boolean;
    error?: string;
    user?: User;
  }>;
};

export default function ProfileForm({
  user,
  updateProfileAction,
}: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await updateProfileAction(formData);

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false);
        router.refresh();
      } else {
        setMessage({ type: "error", text: `Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating your profile.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user.firstName}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            name="surname"
            defaultValue={user.surname}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            disabled={true}
          />
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessLevel">Access Level</Label>
          <Input
            id="accessLevel"
            name="accessLevel"
            defaultValue={user.accessLevel.toString()}
            disabled={true}
          />
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
