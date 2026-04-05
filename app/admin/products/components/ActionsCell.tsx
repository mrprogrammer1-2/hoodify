"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProducts } from "@/lib/actions/deleteProducts";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";

interface ActionsCellProps {
  product: SingleProductClientType;
}

export default function ActionsCell({ product }: ActionsCellProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProducts([product.id]);
      setShowConfirmModal(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(product.id)}
        >
          Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/admin/products/${product.id}`)}
        >
          View product
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setShowConfirmModal(true)}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ConfirmDeleteModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemCount={1}
      />
    </DropdownMenu>
  );
}
