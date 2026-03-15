"use client";

import { useCartStore } from "@/stores/cart-store";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { CartItem } from "./CartItem";
import removeFromCartDb from "@/lib/actions/removeFromCart";
import { incrementCartItemDb } from "@/lib/actions/incrementCartItemDb";
import { decrementCartItemDb } from "@/lib/actions/decrementCartItemDb";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartClient() {
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    isHydrated,
  } = useCartStore();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [mounted, setMounted] = useState(false);
  console.log("itemss", items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !isHydrated) {
    return (
      <div className="max-container mx-auto min-h-screen py-10 flex justify-center items-center">
        <Spinner className="size-14 text-sky-400" />
      </div>
    );
  }

  const removeCartItem = async (item: any) => {
    removeFromCart(item);
    if (isAuthenticated) {
      await removeFromCartDb(item.productId, item.variantId);
    }
  };

  const handleIncrement = async (item: any) => {
    incrementQuantity(item.productId, item.variantId, item.addOns);

    if (isAuthenticated) {
      try {
        await incrementCartItemDb(item.productId, item.variantId);
      } catch (error) {
        console.error("Error in incrementCartItemDb:", error);
      }
    }
  };

  const handleDecrement = async (item: any) => {
    decrementQuantity(item.productId, item.variantId, item.addOns);

    if (isAuthenticated) {
      await decrementCartItemDb(item.productId, item.variantId);
    }
  };

  const getAddOnsKey = (addOns: any[] | undefined) => {
    if (!addOns || addOns.length === 0) return "";
    return JSON.stringify(
      addOns
        .map((a) => ({ id: a.id, text: a.text }))
        .sort((a, b) => a.id.localeCompare(b.id)),
    );
  };

  return (
    <div className="mx-auto w-full min-h-screen py-10">
      {items.length === 0 ? (
        <div className="mt-12 w-full flex flex-col gap-4 justify-center items-center">
          <p className="text-gray-500">Your cart is empty</p>
          <Button>
            <Link href={"/shop"}>Go To Shop</Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            {items.map((item) => {
              // Detect if item has customization
              const hasCustomization =
                item.className?.includes("customized") || false;
              const customizationSides = item.className
                ? (item.className.match(/customized/g) || []).length
                : 0;
              const addOnsKey = getAddOnsKey(item.addOns);

              return (
                <CartItem
                  item={item}
                  key={`${item.productId}-${item.variantId}-${addOnsKey}`}
                  price={item.productPrice}
                  quantity={item.quantity!}
                  image={item.image}
                  name={item.productName}
                  color={item.variantColor}
                  size={item.variantSize}
                  addOns={item.addOns}
                  hasCustomization={hasCustomization}
                  customizationSides={customizationSides}
                  onIncrease={() => handleIncrement(item)}
                  onDecrease={() => handleDecrement(item)}
                  onRemove={() => removeCartItem(item)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
