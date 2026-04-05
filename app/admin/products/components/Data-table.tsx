"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./DataTablePagination";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash } from "lucide-react";
import { deleteProducts } from "@/lib/actions/deleteProducts";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const productIds = selectedRows.map(
      (row) => (row.original as any).id as string,
    );

    if (productIds.length === 0) return;

    setIsDeleting(true);
    try {
      await deleteProducts(productIds);
      setRowSelection({});
      setShowConfirmModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting products:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="mt-5 relative">
      {selectedCount > 0 && (
        <div className="mb-2 flex justify-end absolute -top-11 right-0">
          <Button
            className="bg-red-500 text-white hover:bg-red-400 cursor-pointer"
            onClick={() => setShowConfirmModal(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
            <Trash />
          </Button>
        </div>
      )}
      <ConfirmDeleteModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemCount={selectedCount}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // onClick={() =>
                  //   router.push(`/admin/products/${row.original.id}`)
                  // }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button> */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
