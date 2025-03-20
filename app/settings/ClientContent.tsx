"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { beachDetails } from "@/lib/schema";
import { useState } from "react";
import { LoadingButton } from "@/components/ui/loading-button";
import { Response } from "./actions";

export default function ClientContent({
  initialBeaches,
  handleUpdate,
}: {
  initialBeaches: (typeof beachDetails.$inferInsert)[];
  handleUpdate: (formData: FormData) => Promise<Response>;
}) {
  const [beaches, setBeaches] = useState(initialBeaches);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    console.log(formData);
    const result = await handleUpdate(formData);
    if (result.success) {
      console.log(result.count);
    } else {
      console.log(result.error);
    }
    setLoading(false);
  };
  return (
    <form
      action={(formData) => handleSubmit(formData)}
      className="flex flex-col gap-2"
    >
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {beaches.map((beach) => (
          <div key={beach.beachID} className="flex items-center space-x-2">
            <Checkbox
              id={beach.beachID.toString()}
              name="selectedBeaches" // using [] to indicate an array
              value={beach.beachID.toString()}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={beach.beachID.toString()}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {beach.beach}
              </label>
              <p className="text-sm text-muted-foreground">{beach.area}</p>
            </div>
          </div>
        ))}
      </div>

      <LoadingButton
        className="w-1/2 self-center"
        loading={loading}
        type="submit"
      >
        Save
      </LoadingButton>
    </form>
  );
}
