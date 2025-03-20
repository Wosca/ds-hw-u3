"use server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getBeaches, Response, updateNotificationSettings } from "./actions";
import ClientContent from "./ClientContent";

export default async function SettingsPage() {
  const beaches = await getBeaches();
  async function handleUpdates(formData: FormData): Promise<Response> {
    "use server";
    return updateNotificationSettings(formData);
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Choose your notification settings on this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientContent
            initialBeaches={beaches}
            handleUpdate={handleUpdates}
          />
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-end gap-2"></div>
        </CardFooter>
      </Card>
    </div>
  );
}
