"use client";

import Image from "next/image";
import { Download } from "lucide-react";

type Customization = {
  text?: string | null;
  font?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  previewUrl?: string | null;
};

export default function CustomizationModal({
  open,
  onClose,
  customization,
  productImage,
}: {
  open: boolean;
  onClose: () => void;
  customization: Customization | null;
  productImage: string | null;
}) {
  if (!open || !customization) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Customization Preview</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* Product Preview */}
        {(customization.previewUrl || productImage) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500">
              Product Preview
            </h3>

            <div className="relative w-full h-72 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={customization.previewUrl || productImage!}
                alt="Customized Product"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Text Customization */}
        {customization.text && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500">
              Text Customization
            </h3>

            <div className="border rounded-lg p-4">
              <p
                style={{
                  fontFamily: customization.font || "inherit",
                  color: customization.color || "#000",
                }}
                className="text-lg"
              >
                {customization.text}
              </p>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>Font: {customization.font}</p>
              <p>Color: {customization.color}</p>
            </div>
          </div>
        )}

        {/* Uploaded Image */}
        {customization.imageUrl && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500">
              Uploaded Image
            </h3>

            <div className="relative w-48 h-48 rounded-lg overflow-hidden border">
              <Image
                src={customization.imageUrl}
                alt="Uploaded"
                fill
                className="object-contain"
              />
            </div>

            <a
              href={customization.imageUrl}
              download
              className="inline-flex items-center gap-2 text-sm bg-black text-white px-3 py-2 rounded-lg"
            >
              <Download size={16} />
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
