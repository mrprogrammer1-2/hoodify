"use client";

import { saveHistory } from "@/lib/canvas";
import Dimensions from "./settings/Dimensions";
import Text from "./settings/Text";
import Color from "./settings/Color";
import { useRef, useState } from "react";
import Export from "./settings/Export";
import { AddToCartButton } from "@/components/AddToCartButton";
import { AddOnSelector } from "@/components/AddOnSelector";
import type { AddOn } from "@/stores/cart-store";

type RightBarProps = RightSidebarProps & {
  product?: {
    id: string;
    name: string;
    price: number;
    images: { url: string; color: string | null }[];
  };
  selectedVariant?: {
    id: string;
    color: string;
    size: string | null;
  } | null;
  designs: Record<View, string | null>;
  currentView: View;
};

export default function RightBar({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  undoStackRef,
  redoStackRef,
  isRestoringHistory,
  product,
  designs,
  currentView,
  selectedVariant,
}: RightBarProps) {
  const inputRef = useRef(null);
  const strokeRef = useRef(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const handleInputChange = (property: string, value: string) => {
    isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }));

    const activeObject = fabricRef.current?.getActiveObject();
    if (!activeObject) return;

    if (property === "width") {
      activeObject.set("width", parseInt(value));
      activeObject.set("scaleX", 1);
    } else if (property === "height") {
      activeObject.set("height", parseInt(value));
      activeObject.set("scaleY", 1);
    } else {
      if (activeObject[property as keyof object] === value) return;
      activeObject.set(property as keyof object, value);
    }

    activeObject.setCoords();
    fabricRef.current?.requestRenderAll();
    saveHistory({
      canvas: fabricRef.current!,
      undoStackRef,
      redoStackRef,
      isRestoringHistory,
    });
  };

  return (
    <div className="flex flex-1 flex-col border-t border-border bg-card text-foreground flex-2 sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
      <h3 className="px-5 pt-4 text-xs uppercase">Design</h3>
      <span className="text-xs mt-3 px-5 pb-4  border-b border-gray-800">
        Make changes as you like.
      </span>

      <Dimensions
        width={elementAttributes.width}
        height={elementAttributes.height}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
      />
      <Text
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        fontFamily={elementAttributes.fontFamily}
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={inputRef}
        attribute={elementAttributes.fill}
        placeholder="color"
        attributeType="fill"
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={strokeRef}
        attribute={elementAttributes.stroke}
        placeholder="stroke"
        attributeType="stroke"
        handleInputChange={handleInputChange}
      />
      <Export />

      {product && selectedVariant && (
        <div className="px-5 py-4 border-t border-gray-800 space-y-4">
          {/* Add-ons Section */}
          <div className="border-b border-gray-800 pb-4">
            <AddOnSelector
              selectedAddOns={selectedAddOns}
              onAddOnsChange={setSelectedAddOns}
            />
          </div>

          <AddToCartButton
            productId={product.id}
            variantId={selectedVariant.id}
            productName={product.name}
            productPrice={product.price}
            variantColor={selectedVariant.color}
            variantSize={selectedVariant.size || ""}
            fabricRef={fabricRef}
            designs={designs}
            currentView={currentView}
            addOns={selectedAddOns}
            image={
              product.images.find((img) => img.color === selectedVariant.color)
                ?.url ||
              product.images[0]?.url ||
              ""
            }
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
