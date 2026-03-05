import type { Metadata } from "next";
import Cart from "./Cart";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
};

export default async function CartPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Cart />
      </Suspense>
    </main>
  );
}
