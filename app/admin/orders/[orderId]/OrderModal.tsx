"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, X, ZoomIn, Type } from "lucide-react";

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
  imageUrl: string | null;
};

export default function OrderModal({
  selectedItem,
  onClose,
}: {
  selectedItem: OrderItem | null;
  onClose: () => void;
}) {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const handleDownload = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `design-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal Card */}
        <div
          className="relative bg-white dark:bg-gradient-to-b dark:from-[#1a1d2e] dark:to-[#141623] border border-gray-100 dark:border-white/[0.07] rounded-2xl shadow-xl dark:shadow-none w-full max-w-2xl overflow-hidden mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06]">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-gray-500">
                Customization Preview
              </p>
              {selectedItem?.productName && (
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                  {selectedItem.productName}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedItem?.customization && (
              <div className="grid grid-cols-2 gap-5">
                {Object.entries(selectedItem.customization).map(
                  ([place, view]) => (
                    <div key={place} className="space-y-3">
                      {/* Label pill */}
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 dark:bg-sky-500" />
                        {place.replace(/-/g, " ")}
                      </span>

                      {/* Image */}
                      <div
                        className="group relative aspect-square bg-gray-50 dark:bg-[#0f1018] border border-gray-100 dark:border-white/[0.06] rounded-xl overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-white/[0.15] hover:-translate-y-0.5 transition-all duration-200"
                        onClick={() => setEnlargedImage(view.imageUrl)}
                      >
                        <Image
                          src={view.imageUrl}
                          alt={place}
                          fill
                          className="object-contain p-3"
                        />
                        {/* Zoom overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2.5 text-white">
                            <ZoomIn size={16} />
                          </div>
                        </div>
                      </div>

                      {/* Text details */}
                      {view.texts && view.texts.length > 0 && (
                        <div className="space-y-2">
                          {view.texts.map((text, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] rounded-lg px-3.5 py-2.5 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                            >
                              <p className="font-mono text-[13px] font-medium text-gray-800 dark:text-gray-100 mb-1.5">
                                {text.text}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                                <Type
                                  size={9}
                                  className="text-gray-300 dark:text-gray-600"
                                />
                                <span>{text.fontFamily}</span>
                                <span className="text-gray-200 dark:text-gray-700">
                                  ·
                                </span>
                                <span>{text.fontSize}px</span>
                                <span className="text-gray-200 dark:text-gray-700">
                                  ·
                                </span>
                                <span
                                  className="w-3 h-3 rounded-sm border border-black/10 dark:border-white/15 flex-shrink-0"
                                  style={{ backgroundColor: text.fill }}
                                />
                                <span className="font-mono text-[10px]">
                                  {text.fill}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enlarged image overlay */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={enlargedImage}
              alt="Enlarged view"
              width={700}
              height={700}
              className="object-contain rounded-xl max-w-[88vw] max-h-[85vh]"
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-3 left-3 flex items-center justify-center w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <X size={15} />
            </button>
            <button
              onClick={() => handleDownload(enlargedImage)}
              className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 bg-sky-500/20 backdrop-blur-sm border border-sky-400/30 rounded-lg text-sky-400 hover:bg-sky-500/30 transition-colors"
            >
              <Download size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
