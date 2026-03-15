"use client";

import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CartSummary({ currentStep }: { currentStep: number }) {
  const { items } = useCartStore();

  const totalItems = items.reduce(
    (total, item) => total + item.productPrice * (item.quantity ?? 0),
    0,
  );

  const addOnTotal = items.reduce((total, item) => {
    const addOnsPrice = (item.addOns || []).reduce(
      (sum, addon) => sum + addon.price,
      0,
    );
    return total + addOnsPrice;
  }, 0);

  const subtotal = totalItems + addOnTotal;

  const shipping = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  const router = useRouter();

  return (
    <div className="border rounded-xl p-6 space-y-4 bg-card">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{subtotal.toFixed(0)} EGP</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `${shipping.toFixed(0)} EGP`}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (14%)</span>
          <span>{tax.toFixed(0)} EGP</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{total.toFixed(0)} EGP</span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <Button
          onClick={() => router.push("/cart?step=2")}
          className="w-full"
          size="lg"
          disabled={items.length === 0}
        >
          Continue
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
}
