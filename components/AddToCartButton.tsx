"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/createOrder";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type AddToCartButtonProps = {
  orderId?: string;
  productId: string;
  variantId?: string;
  productName: string;
  productPrice: number;
  variantColor?: string;
  variantSize?: string;
  quantity?: number;
  // customization?: Record<string, any>;
  image: string;
  className?: string;
};

export function AddToCartButton({
  productId,
  variantId,
  productName,
  productPrice,
  variantColor,
  variantSize,
  quantity = 1,
  // customization,
  image,
  className,
}: AddToCartButtonProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useKindeBrowserClient();

  const [isAdding, setIsAdding] = useState(false);

  const canAddTocart = Boolean(variantColor && variantSize);

  const handleAddToCart = async () => {
    setIsAdding(true);

    const cartItem = {
      productId,
      variantId,
      productName,
      productPrice,
      variantColor,
      variantSize,
      quantity,
      // customization,
      image,
    };

    addToCart(cartItem);
    setIsAdding(false);
    const size = variantSize as string;
    const color = variantColor as string;
    if (!isAuthenticated) return;
    createOrder({ productId, size, color });
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!canAddTocart || isAdding}
      className={className}
    >
      {isAdding ? (
        <Plus className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
