"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import { AddOnSelector } from "@/components/AddOnSelector";
import Link from "next/link";
import { Paintbrush } from "lucide-react";
import type { AddOn } from "@/stores/cart-store";

export default function SingleProductClient({
  product,
}: {
  product: SingleProductClientType;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  // Update main image whenever selectedColor changes
  useEffect(() => {
    if (selectedColor) {
      const frontImages = product.images.filter((img) => img.place === "front");
      const colorMatch = frontImages.find((img) => img.color === selectedColor);
      setMainImage(
        colorMatch?.url ||
          frontImages[0]?.url ||
          product.images[0]?.url ||
          null,
      );
    } else {
      setMainImage(
        product.images.find((img) => img.place === "front")?.url ||
          product.images[0]?.url ||
          null,
      );
    }
  }, [selectedColor, product.images]);

  const sizes = useMemo(() => {
    return Array.from(
      new Set(product.variants.map((variant) => variant.size)),
    ).filter(Boolean) as string[];
  }, [product.variants]);

  const filteredColors = useMemo(() => {
    if (!selectedSize) return [];
    return product.variants.filter((variant) => variant.size === selectedSize);
  }, [product.variants, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null;
    return product.variants.find(
      (variant) =>
        variant.size === selectedSize && variant.color === selectedColor,
    );
  }, [product.variants, selectedSize, selectedColor]);

  const displayedPrice = useMemo(() => {
    if (selectedVariant?.price != null) return selectedVariant.price;
    return product.price;
  }, [selectedVariant, product.price]);

  const canCustomize = Boolean(selectedSize && selectedColor);

  const cartImage = useMemo(() => {
    return (
      product.images.find(
        (img) => img.place === "front" && img.color === selectedColor,
      )?.url ||
      product.images.find((img) => img.place === "front")?.url ||
      product.images[0]?.url ||
      ""
    );
  }, [selectedColor, product.images]);

  return (
    <div className="h-screen w-screen">
      <div className="max-container my-12 px-4 flex flex-col md:flex-row gap-3 md:gap-24">
        {/* Product image */}
        <div className="flex-1 relative">
          <Image
            src={mainImage || product.images[0]?.url || ""}
            alt={product?.name || ""}
            width={500}
            height={500}
            className="mb-4 object-cover w-full h-full rounded transition-opacity duration-300"
            loading="eager"
          />
          {/* Color thumbnail strip */}
          {selectedSize && filteredColors.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {filteredColors.map((variant) => {
                const variantFrontImg = product.images.find(
                  (img) => img.place === "front" && img.color === variant.color,
                );
                return variantFrontImg ? (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedColor(variant.color)}
                    className={`w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                      selectedColor === variant.color
                        ? "border-blue-500 scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={variantFrontImg.url}
                      alt={variant.color}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="flex-1 font-mono pt-24 tracking-tight space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            {product.description && (
              <p className="text-gray-700 mb-4">{product.description}</p>
            )}
            <p className="text-lg font-bold mb-4 text-green-700">
              ${displayedPrice.toFixed(2)}
            </p>

            {/* Sizes */}
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <Button
                  key={size}
                  className={`bg-gray-200 text-black w-12 h-8 grid place-content-center cursor-pointer text-sm transition-all hover:bg-gray-300 ${
                    selectedSize === size
                      ? "border-2 border-blue-500 font-bold"
                      : "border"
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedColor(null);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>

            {/* Colors */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {selectedSize &&
                filteredColors.map((variant) => (
                  <span
                    key={variant.id}
                    title={variant.stringColor ?? variant.color ?? ""}
                    className={`size-10 border cursor-pointer rounded-sm transition-all ${
                      selectedColor === variant.color
                        ? "border-black border-2 dark:border-gray-200 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: variant.color ?? undefined }}
                    onClick={() => setSelectedColor(variant.color)}
                  />
                ))}
            </div>

            {!selectedSize && (
              <p className="text-sm text-gray-500 mt-3">
                Select a size to see available colors
              </p>
            )}

            {selectedSize && !selectedColor && (
              <p className="text-sm text-gray-500 mt-3">
                Select a color to continue
              </p>
            )}

            {/* Selected variant summary */}
            {selectedVariant && (
              <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded p-3 border">
                <p>
                  <span className="font-semibold">Selected:</span>{" "}
                  {selectedVariant.size} /{" "}
                  {selectedVariant.stringColor ?? selectedVariant.color}
                </p>
                {selectedVariant.stock != null && (
                  <p
                    className={
                      selectedVariant.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} in stock`
                      : "Out of stock"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Add Patch Section */}
          {canCustomize && (
            <div className="border-t pt-4">
              <AddOnSelector
                selectedAddOns={selectedAddOns}
                onAddOnsChange={setSelectedAddOns}
              />
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <AddToCartButton
              productId={product.id}
              productPrice={displayedPrice}
              variantId={selectedVariant?.id || ""}
              productName={product.name}
              variantColor={selectedVariant?.color || ""}
              variantSize={selectedVariant?.size || ""}
              image={cartImage}
              quantity={1}
              addOns={selectedAddOns}
            />

            {/* Customize button */}
            <Button
              disabled={!canCustomize}
              asChild={canCustomize}
              title={
                !canCustomize
                  ? "Please select a size and color first"
                  : "Customize this product"
              }
              className={`gap-2 ${
                !canCustomize ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {canCustomize ? (
                <Link
                  href={`/editor/${product.id}?size=${selectedSize}&color=${encodeURIComponent(selectedColor!)}`}
                >
                  <Paintbrush className="h-4 w-4" />
                  Customize
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Customize
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
