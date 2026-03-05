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

    if (!isAuthenticated) {
      setHydrated();
      return;
    }

    // const isCartItemType = (value: string): value is CartItemType =>
    //   value === "product" || value === "customization" || value === "addon";

    const hasSynced = localStorage.getItem(HAS_SYNCED_KEY);

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

      const persisted = localStorage.getItem("cart-storage");
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
            // itemType: isCartItemType(item.itemType) ? item.itemType : "product",
            image: item.image ?? "/placeholder.png",
          })),
        );

        localStorage.removeItem("cart-storage");
        setHydrated();

        return;
      }

      setItemsFromServer(cartItems);
      if (cartItems.length === 0) {
        clearCart();
      }
      localStorage.removeItem("cart-storage");
      setHydrated();
    })();
  }, [isAuthenticated, isLoading, clearCart, setItemsFromServer, setHydrated]);

  return null;
}
