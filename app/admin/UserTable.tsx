"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";

export type UserData = {
  email: string;
  firstName: string;
  surname: string;
  password: string;
  accessLevel: number;
};

type UserTableProps = {
  initialData: UserData[];
  refreshData: () => Promise<UserData[]>;
  updateUser: (
    formData: FormData
  ) => Promise<{ success: boolean; error: { message: string }[] }>;
  deleteUser: (email: string) => Promise<void>;
};

export default function UserTable({
  initialData,
  refreshData,
  updateUser,
  deleteUser,
}: UserTableProps) {
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Use React Query to fetch and refresh our user data.
  // We combine isLoading and isFetching to decide when to show the skeleton.
  const { data, isLoading, isFetching, refetch } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: refreshData,
    initialData,
  });

  const loading = isLoading || isFetching;

  // Define the table columns, including an actions column.
  const columns = React.useMemo<ColumnDef<UserData>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "surname",
        header: "Surname",
      },
      {
        accessorKey: "accessLevel",
        header: "Access Level",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(user)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    deleteUser(user.email).then(() => {
                      toast.success("User deleted successfully!");
                      refetch();
                    });
                  } catch (error) {
                    toast.error("Failed to delete user.");
                    console.error(error);
                  }
                }}
              >
                <Trash2Icon className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteUser, refetch]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Calculate the number of header cells for our skeleton rows.
  const headers = table.getHeaderGroups()[0]?.headers || [];

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading
              ? // Show 5 skeleton rows while loading
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {headers.map((_, i) => (
                      <TableCell key={`skeleton-cell-${rowIndex}-${i}`}>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Otherwise, render the actual table rows
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <Dialog
          open={!!editingUser}
          onOpenChange={(open) => {
            if (!open) {
              setEditingUser(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <span />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateUser(formData).then((response) => {
                  if (response.success) {
                    toast.success("User updated successfully!");
                    setEditingUser(null);
                    refetch();
                  } else {
                    console.log(response);
                    toast.error("Failed to update user.", {
                      description: response.error.map(
                        (error) => error.message + ", "
                      ),
                    });
                  }
                });
              }}
              className="space-y-4"
            >
              <Input
                type="hidden"
                name="email"
                data-1p-ignore
                defaultValue={editingUser.email}
              />
              <div>
                <Label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  data-1p-ignore
                  defaultValue={editingUser.firstName}
                />
              </div>
              <div>
                <Label
                  htmlFor="surname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Surname
                </Label>
                <Input
                  id="surname"
                  name="surname"
                  data-1p-ignore
                  defaultValue={editingUser.surname}
                />
              </div>
              <div>
                <Label
                  htmlFor="accessLevel"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Access Level
                </Label>
                <Input
                  id="accessLevel"
                  name="accessLevel"
                  type="number"
                  data-1p-ignore
                  defaultValue={editingUser.accessLevel.toString()}
                />
              </div>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
