import { columns } from "./Columns";
import { DataTable } from "./Data-table";

type Order = {
  id: string;
  userId: string;
  status:
    | "cart"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  totalPrice: number;
  customerName: string;
  currency: string;
  createdAt: Date;
};

// async function getData(): Promise<Order[]> {
//   return await getOrders();
// }

export default function OrdersTable({ data }: { data: Order[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
