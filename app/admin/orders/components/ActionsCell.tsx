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
  currency: string;
  createdAt: Date;
};

interface ActionsCellProps {
  order: Order;
}

export default function ActionsCell({ order }: ActionsCellProps) {
  const router = useRouter();

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
          onClick={() => navigator.clipboard.writeText(order.id)}
        >
          Copy order ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/admin/orders/${order.id}`)}
        >
          View order
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${order.userId}`)}
        >
          View User
        </DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
