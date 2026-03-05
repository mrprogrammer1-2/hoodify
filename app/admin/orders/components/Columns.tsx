"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import ActionsCell from "./ActionsCell";

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

const formatEgp = (value: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(value);

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order ID",
    cell: (info) => {
      const id = info.getValue() as string;
      return <span className="font-mono text-xs">{id.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: (info) => {
      const userId = info.getValue() as string;
      return <span className="font-mono text-xs">{userId.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    enableSorting: true,
    cell: (info) => {
      const customerName = info.getValue() as string;
      return <span className="capitalize">{customerName}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: (info) => {
      const status = info.getValue() as string;
      const statusColors: Record<string, string> = {
        cart: "bg-gray-600 text-white dark:text-black",
        pending: "bg-yellow-600 text-white",
        processing: "bg-blue-600 text-white",
        shipped: "bg-purple-600 text-white",
        delivered: "bg-green-600 text-white",
        cancelled: "bg-red-600 text-white",
      };
      return (
        <span
          className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-600 text-white"}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "totalItems",
    header: "Items",
    enableSorting: true,
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    enableSorting: true,
    cell: (info) => formatEgp(info.getValue() as number),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Created at
          <span className="ml-2">
            {isSorted === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : isSorted === "desc" ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </span>
        </Button>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue<string>(columnId)).getTime();
      const b = new Date(rowB.getValue<string>(columnId)).getTime();
      return a === b ? 0 : a > b ? 1 : -1;
    },
    cell: (info) => {
      const val = info.getValue() as string | undefined;
      if (!val) return "-";
      const date = new Date(val);
      return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return <ActionsCell order={order} />;
    },
  },
];
