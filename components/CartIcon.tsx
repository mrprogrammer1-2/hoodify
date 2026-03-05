"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CartIcon() {
  const { getTotalItems, setHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHydrated();
  }, [setHydrated]);

  if (!mounted) {
    return (
      <div className="relative cursor-pointer">
        <ShoppingCart className="h-6 w-6" />
      </div>
    );
  }

  const totalItems = getTotalItems();

  return (
    <Link href={"/cart"} className="relative cursor-pointer">
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
