"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import Image from "next/image";
import ActionsCell from "./ActionsCell";

// helper for formatting EGP currency
const formatEgp = (value: number) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(value);

export const columns: ColumnDef<SingleProductClientType>[] = [
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
    accessorKey: "images",
    header: "Image",
    cell: (info) => {
      const imgs = info.getValue() as SingleProductClientType["images"];
      const src =
        imgs?.find((img) => img.place === "front")?.url || imgs?.[0]?.url || "";
      return (
        <Image
          src={src}
          alt="product"
          width={40}
          height={40}
          className="object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "price",
    header: "Price",
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
      const product = row.original;
      return <ActionsCell product={product} />;
    },
  },
];
