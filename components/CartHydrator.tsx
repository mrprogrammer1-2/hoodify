"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { getUserCart } from "@/lib/actions/getUserCart";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { syncCart } from "@/lib/actions/syncCart";

export function CartHydrator() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  console.log("cart hydrator");

  const setItemsFromServer = useCartStore((s) => s.setItemsFromServer);
  const clearCart = useCartStore((s) => s.clearCart);
  const setHydrated = useCartStore((s) => s.setHydrated);

  const HAS_SYNCED_KEY = "cart-synced";

  useEffect(() => {
    if (isLoading) return; // ⛔ wait for Kinde

    // Clear persisted cart data immediately to prevent stale data
    if (typeof window !== 'undefined') {
      localStorage.removeItem("cart-storage");
    }

    if (!isAuthenticated) {
      setHydrated();
      return;
    }

    const hasSynced = typeof window !== 'undefined' ? localStorage.getItem(HAS_SYNCED_KEY) : null;

    (async () => {
      const serverItems = await getUserCart();

      const cartItems = serverItems.map((item) => ({
        orderItemId: item.orderItemId,
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        productName: item.productName ?? "Unknown product",
        productPrice: item.unitPrice,
        variantColor: item.color ?? undefined,
        variantSize: item.size ?? undefined,
        quantity: item.quantity,
        image: item.image ?? "/placeholder.png",
      }));

      const persisted = typeof window !== 'undefined' ? localStorage.getItem("cart-storage") : null;
      const guestItems = persisted
        ? (JSON.parse(persisted)?.state?.items ?? [])
        : [];

      if (guestItems.length && !hasSynced && serverItems.length === 0) {
        console.log("Syncing guest cart to server");
        await syncCart(
          guestItems.map((item: CartItem) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.productPrice,
          })),
        );

        localStorage.setItem(HAS_SYNCED_KEY, "true");

        const freshItems = await getUserCart();

        setItemsFromServer(
          freshItems.map((item) => ({
            orderItemId: item.orderItemId,
            productId: item.productId,
            variantId: item.variantId ?? undefined,
            productName: item.productName ?? "Unknown product",
            productPrice: item.unitPrice,
            variantColor: item.color ?? undefined,
            variantSize: item.size ?? undefined,
            quantity: item.quantity,
            image: item.image ?? "/placeholder.png",
          })),
        );

        setHydrated();

        return;
      }

      // Always sync server items to store - this ensures cart reflects current DB state
      setItemsFromServer(cartItems);
      setHydrated();
    })();
  }, [isAuthenticated, isLoading, clearCart, setItemsFromServer, setHydrated]);

  return null;
}
