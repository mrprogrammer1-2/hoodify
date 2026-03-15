"use client";

import { useState } from "react";
import Image from "next/image";
import { updateOrderStatus } from "@/lib/actions/updateOrderStatus";
import OrderModal from "./OrderModal";
import AddOnModal from "./AddOnModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

type TextDetail = {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fill: string;
};

type ViewCustomization = {
  imageUrl: string;
  texts: TextDetail[];
};

type Customization = Record<string, ViewCustomization>;

type AddOn = {
  id: string;
  name: string;
  price: number;
  text?: string;
};

type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  productName: string | null;
  variantColor: string | null;
  variantSize: string | null;
  customization: Customization | null;
  addOn: AddOn[] | null;
  imageUrl: string | null;
};

type Order = {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  currency: string;
  createdAt: Date | string;
  customerName: string | null;
  customerEmail: string | null;
  items: OrderItem[];
} | null;

const statusConfig: Record<
  string,
  { label: string; classes: string; dot: string }
> = {
  pending: {
    label: "Pending",
    classes:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    dot: "bg-amber-500 dark:shadow-amber-500/50",
  },
  processing: {
    label: "Processing",
    classes:
      "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
    dot: "bg-sky-500 dark:shadow-sky-500/50",
  },
  shipped: {
    label: "Shipped",
    classes:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    dot: "bg-violet-500 dark:shadow-violet-500/50",
  },
  delivered: {
    label: "Delivered",
    classes:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    dot: "bg-emerald-500 dark:shadow-emerald-500/50",
  },
  cancelled: {
    label: "Cancelled",
    classes:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    dot: "bg-red-500 dark:shadow-red-500/50",
  },
};

function formatCurrency(amount: number, currency: string) {
  if (currency === "EGP") {
    return `${amount.toFixed(0)} EGP`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4 py-2">
      <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium text-gray-800 dark:text-gray-200 truncate ${mono ? "font-mono text-sky-600 dark:text-sky-400 text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SingleOrderClient({ order }: { order: Order }) {
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[] | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [currentStatus, setCurrentStatus] = useState(
    order?.status || "pending",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (
    newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  ) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const calculatePriceBreakdown = (item: OrderItem) => {
    let customizationPrice = 0;
    let addOnPrice = 0;

    if (item.customization) {
      const sidesCustomized = Object.keys(item.customization).length;
      customizationPrice = sidesCustomized * 100;
    }

    if (item.addOn && Array.isArray(item.addOn)) {
      addOnPrice = item.addOn.reduce((sum, addon) => sum + addon.price, 0);
    }

    const basePrice = item.unitPrice - customizationPrice - addOnPrice;

    return {
      basePrice,
      customizationPrice,
      addOnPrice,
      total: item.unitPrice,
    };
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="text-6xl">📦</span>
        <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
          Order not found
        </h2>
      </div>
    );
  }

  const status = statusConfig[currentStatus?.toLowerCase()] ?? {
    label: currentStatus,
    classes:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/40 dark:text-gray-400 dark:border-gray-600/30",
    dot: "bg-gray-400",
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-5">
          {/* ── Header ── */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500 mb-1">
                Order Receipt
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                {formatDate(order.createdAt)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide ${status.classes}`}
                  disabled={isUpdating}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shadow-sm ${status.dot}`}
                  />
                  {status.label}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusChange("pending")}
                  disabled={currentStatus === "pending" || isUpdating}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("processing")}
                  disabled={currentStatus === "processing" || isUpdating}
                >
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("shipped")}
                  disabled={currentStatus === "shipped" || isUpdating}
                >
                  Shipped
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("delivered")}
                  disabled={currentStatus === "delivered" || isUpdating}
                >
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={currentStatus === "cancelled" || isUpdating}
                >
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Info Cards ── */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="bg-white dark:bg-gradient-to-b dark:from-[#1a1d2e] dark:to-[#141623] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm dark:shadow-none">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-gray-600 mb-2">
                Customer
              </p>
              <InfoRow label="Name" value={order.customerName || "N/A"} />
              <div className="border-t border-gray-100 dark:border-white/[0.05]" />
              <InfoRow label="Email" value={order.customerEmail || "N/A"} />
              <div className="border-t border-gray-100 dark:border-white/[0.05]" />
              <InfoRow label="User ID" value={order.userId.slice(0, 14)} mono />
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-gradient-to-b dark:from-[#1a1d2e] dark:to-[#141623] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm dark:shadow-none">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-gray-600 mb-2">
                Payment
              </p>
              <InfoRow
                label="Subtotal"
                value={formatCurrency(subtotal, order.currency)}
              />
              <div className="border-t border-gray-100 dark:border-white/[0.05]" />
              <InfoRow label="Currency" value={order.currency} mono />
              <div className="border-t border-gray-200 dark:border-white/[0.07] mt-1 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(order.totalPrice, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Items Table ── */}
          <div className="bg-white dark:bg-gradient-to-b dark:from-[#1a1d2e] dark:to-[#141623] border border-gray-100 dark:border-white/[0.07] rounded-2xl p-5 shadow-sm dark:shadow-none">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-gray-600 mb-4">
              Items ({order.items.length})
            </p>

            <div className="space-y-4">
              {order.items.map((item) => {
                const isExpanded = expandedItems.has(item.id);
                const breakdown = calculatePriceBreakdown(item);

                return (
                  <div
                    key={item.id}
                    className="border border-gray-100 dark:border-white/[0.06] rounded-lg overflow-hidden"
                  >
                    {/* Item Header */}
                    <button
                      onClick={() => toggleItemExpanded(item.id)}
                      className="w-full p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        {item.imageUrl && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt="product"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-gray-100 text-[13px]">
                            {item.productName || "Unknown Product"}
                          </p>
                          <p className="font-mono text-[10px] text-gray-300 dark:text-gray-600 mt-0.5">
                            {item.productId.slice(0, 8)}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-[13px]">
                              {formatCurrency(
                                item.unitPrice * item.quantity,
                                order.currency,
                              )}
                            </p>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Item Details - Expandable */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-white/[0.06] p-4 bg-gray-50 dark:bg-white/[0.02] space-y-4">
                        {/* Variant Info */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-600 mb-2">
                            VARIANT
                          </p>
                          {(item.variantColor || item.variantSize) && (
                            <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 text-[11px] font-medium px-2.5 py-1 rounded-md">
                              {item.variantColor}
                              {item.variantColor && item.variantSize && (
                                <span className="opacity-30">·</span>
                              )}
                              {item.variantSize}
                            </span>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-lg p-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-600 mb-2">
                            PRICE BREAKDOWN
                          </p>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                              <span>Base price (variant):</span>
                              <span>
                                {formatCurrency(
                                  breakdown.basePrice,
                                  order.currency,
                                )}
                              </span>
                            </div>
                            {breakdown.customizationPrice > 0 && (
                              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Customization:</span>
                                <span>
                                  +
                                  {formatCurrency(
                                    breakdown.customizationPrice,
                                    order.currency,
                                  )}
                                </span>
                              </div>
                            )}
                            {breakdown.addOnPrice > 0 && (
                              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Add-ons:</span>
                                <span>
                                  +
                                  {formatCurrency(
                                    breakdown.addOnPrice,
                                    order.currency,
                                  )}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-white/[0.08] pt-1.5">
                              <span>Unit price:</span>
                              <span>
                                {formatCurrency(item.unitPrice, order.currency)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Customization & Add-ons */}
                        <div className="flex flex-wrap gap-2">
                          {item.customization && (
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="inline-flex items-center gap-1.5 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/25 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors font-semibold text-[11px]"
                            >
                              View Design
                            </button>
                          )}

                          {item.addOn && item.addOn.length > 0 && (
                            <button
                              onClick={() => setSelectedAddOns(item.addOn)}
                              className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/25 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-md font-medium text-[11px] hover:bg-purple-200 dark:hover:bg-purple-500/20 transition-colors"
                            >
                              📌 View Add-on
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <OrderModal
          onClose={() => setSelectedItem(null)}
          selectedItem={selectedItem}
        />
      )}

      {selectedAddOns && (
        <AddOnModal
          addOns={selectedAddOns}
          onClose={() => setSelectedAddOns(null)}
        />
      )}
    </>
  );
}
