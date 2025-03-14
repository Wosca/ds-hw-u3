import { Suspense } from "react";
import FileUploader from "./FileUploader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (session?.user.accessLevel !== 3) {
    redirect("/signin");
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shark Report Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Shark Data</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file with shark sighting data. The system will process
          new sharks and reports.
        </p>

        <Suspense fallback={<div>Loading uploader...</div>}>
          <FileUploader />
        </Suspense>
      </div>
    </div>
  );
}
