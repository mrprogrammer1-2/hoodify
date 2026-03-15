"use client";

import Image from "next/image";
import { QuantityControl } from "@/app/(user)/cart/QuantityControl";
import type { AddOn } from "@/stores/cart-store";
import { useState } from "react";
import EditAddOnModal from "./EditAddOnModal";

type CartItemProps = {
  item: {
    productId: string;
    variantId?: string;
    productName: string;
    productPrice: number;
    image: string;
    quantity?: number;
    className?: string;
    addOn?: AddOn[];
  };
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  addOns?: AddOn[];
  hasCustomization?: boolean;
  customizationSides?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItem({
  item,
  name,
  image,
  price,
  quantity,
  color,
  size,
  addOns = [],
  hasCustomization = false,
  customizationSides = 0,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const addOnsTotal = addOns.reduce((sum, addon) => sum + addon.price, 0);
  const itemTotal = price * quantity;
  const total = itemTotal + addOnsTotal;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>(addOns || []);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Top Section */}
      <div className="flex gap-5">
        {/* Product Image */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border bg-zinc-100">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{name}</h3>

            <button
              onClick={onRemove}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Remove
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {color && `Color: ${color}`} {size && ` | Size: ${size}`}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {hasCustomization && (
              <span className="text-xs px-2 py-1 rounded-md bg-sky-100 text-sky-700 font-medium">
                ✏️ Customized ({customizationSides} side
                {customizationSides !== 1 ? "s" : ""})
              </span>
            )}

            {addOns.length > 0 && (
              <span className="text-xs px-2 py-1 rounded-md bg-purple-100 text-purple-700 font-medium">
                📌 {addOns.length} Add-on
              </span>
            )}
          </div>

          {/* Small Edit Add-ons button */}
          {addOns.length > 0 && (
            <button
              onClick={() => {
                setEditModalOpen(true);
                setSelectedAddons(addOns as AddOn[]);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Edit add-ons
            </button>
          )}
        </div>

        {/* Quantity */}
        <div className="flex flex-col justify-between items-end">
          <QuantityControl
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t my-4" />

      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Base price</span>
          <span>{(price / quantity).toFixed(0)} EGP</span>
        </div>

        {hasCustomization && customizationSides > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>
              Customization ({customizationSides} side
              {customizationSides !== 1 ? "s" : ""})
            </span>
            <span>+{(customizationSides * 100).toFixed(0)} EGP</span>
          </div>
        )}

        {addOnsTotal > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Add-ons</span>
            <span>+{addOnsTotal.toFixed(0)} EGP</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{total.toFixed(0)} EGP</span>
        </div>
      </div>

      {editModalOpen && item.variantId && (
        <EditAddOnModal
          selectedAddons={selectedAddons}
          variantId={item.variantId}
          productId={item.productId}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}
