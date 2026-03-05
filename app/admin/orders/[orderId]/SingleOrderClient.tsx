"use client";

import Image from "next/image";

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
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  processing: {
    label: "Processing",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  shipped: {
    label: "Shipped",
    classes: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-400",
  },
  delivered: {
    label: "Delivered",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
};

function formatCurrency(amount: number, currency: string) {
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
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-gray-400 shrink-0">{label}</span>
      <span
        className={`text-sm font-medium text-gray-800 truncate text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SingleOrderClient({ order }: { order: Order }) {
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <span className="text-6xl">📦</span>
        <h2 className="text-2xl font-semibold text-gray-800">
          Order not found
        </h2>
        <p className="text-gray-500">
          This order doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }
  console.log(order);

  const status = statusConfig[order.status?.toLowerCase()] ?? {
    label: order.status,
    classes: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
            Order Receipt
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.classes}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            👤 Customer
          </h3>
          <div className="space-y-2">
            <InfoRow label="Name" value={order.customerName || "N/A"} />
            <InfoRow label="Email" value={order.customerEmail || "N/A"} />
            <InfoRow
              label="User ID"
              value={order.userId.slice(0, 12) + "…"}
              mono
            />
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            💳 Payment
          </h3>
          <div className="space-y-2">
            <InfoRow
              label="Subtotal"
              value={formatCurrency(subtotal, order.currency)}
            />
            <InfoRow label="Currency" value={order.currency.toUpperCase()} />
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(order.totalPrice, order.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">
          🛒 Items ({order.items.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold tracking-wider uppercase text-gray-400">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 px-4">Variant</th>
                <th className="pb-3 px-4 text-center">Qty</th>
                <th className="pb-3 px-4 text-right">Unit Price</th>
                <th className="pb-3 pl-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-800 block">
                          {item.productName || "Unknown Product"}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {item.productId.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {item.variantColor && (
                        <div className="text-gray-700">{item.variantColor}</div>
                      )}
                      {item.variantSize && (
                        <div className="text-gray-500 text-xs">
                          {item.variantSize}
                        </div>
                      )}
                      {!item.variantColor && !item.variantSize && (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500">
                    {formatCurrency(item.unitPrice, order.currency)}
                  </td>
                  <td className="py-3 pl-4 text-right font-semibold text-gray-800">
                    {formatCurrency(
                      item.unitPrice * item.quantity,
                      order.currency,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-100">
                <td
                  colSpan={4}
                  className="pt-4 pr-4 text-right text-sm font-semibold text-gray-500"
                >
                  Order Total
                </td>
                <td className="pt-4 pl-4 text-right text-lg font-bold text-gray-900">
                  {formatCurrency(order.totalPrice, order.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
