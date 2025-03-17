import { deleteUser, getUsers, updateUser } from "./actions";
import UserTable from "./UserTable";

export default async function UsersPage() {
  // Fetch users on the server (this will run at request time)
  const users = await getUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserTable
        initialData={users}
        refreshData={getUsers}
        updateUser={updateUser}
        deleteUser={deleteUser}
      />
    </div>
  );
}
