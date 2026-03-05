import { getAllUsers } from "@/lib/queries/userQueries";
import { columns } from "./Columns";
import { DataTable } from "./Data-table";

// async function getData(search?: string): Promise<User[]> {
//   // Fetch products from the server instead of stubbed data
//   return await getAllUsers(search);
// }

export default async function UsersTable({ search }: { search?: string }) {
  const data = await getAllUsers(search);
  console.log(data);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
