"use client";

import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CartSummary({ currentStep }: { currentStep: number }) {
  const { items } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.productPrice * (item.quantity ?? 0),
    0,
  );

  const shipping = subtotal > 0 ? 50 : 0; // Free shipping over certain amount
  const tax = subtotal * 0.14; // 14% tax
  const total = subtotal + shipping + tax;

  const router = useRouter();

  return (
    <div className="border rounded-xl p-6 space-y-4 bg-card">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (14%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
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
          {/* <Link href="/checkout" className="w-full">
          Proceed to Checkout
        </Link> */}
          Continue
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
}
