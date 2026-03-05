import { columns } from "./Columns";
import { DataTable } from "./Data-table";
import { getAllProducts } from "@/lib/queries/productQueries";

async function getData(search?: string): Promise<SingleProductClientType[]> {
  // Fetch products from the server instead of stubbed data
  return await getAllProducts(search);
}

export default async function ProductsTable({ search }: { search?: string }) {
  const data = await getData(search);
  console.log(data);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
