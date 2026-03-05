"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import Link from "next/link";

export default function SingleProductClient({
  product,
}: {
  product: SingleProductClientType;
}) {
  console.log("productssss", product);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const sameColorImg = product.images.filter((img) => img.place === "front");

    setMainImage(
      sameColorImg.find((img) => img.color === selectedColor)?.url || "",
    );
  }, [selectedColor, product.images]);

  console.log("single product", product);

  const sizes = useMemo(() => {
    return Array.from(
      // new Set([...]) Automatically removes duplicates Keeps only unique values
      new Set(product.variants.map((variant) => variant.size)),
      // filter(Boolean) This removes falsy values, like:
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
    if (selectedVariant?.price != null) {
      return selectedVariant.price;
    }

    return product.price;
  }, [selectedVariant, product.price]);

  return (
    <div className="h-screen w-screen">
      <div className="max-container my-12 px-4 flex flex-col md:flex-row gap-3 md:gap-24">
        <Image
          src={mainImage || product.images[0]?.url || ""}
          alt={product?.name || ""}
          width={300}
          height={300}
          className="mb-4 flex-1 object-cover w-full h-full rounded"
          loading="eager"
        />
        <div className="flex-1 font-mono pt-24 tracking-tight">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          {product.description && (
            <p className="text-gray-700 mb-4">{product.description}</p>
          )}
          <p className="text-lg font-bold mb-4 text-green-700">
            ${displayedPrice.toFixed(2)}
          </p>

          {/* sizes */}
          <div className="flex gap-2">
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

          {/* colors */}
          <div className="flex gap-2 mt-5">
            {selectedSize &&
              filteredColors.map((variant) => (
                <span
                  key={variant.id}
                  className={`size-10 border cursor-pointer ${
                    selectedColor === variant.color
                      ? "border-black border-2 dark:border-gray-200"
                      : ""
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
          <AddToCartButton
            productId={product.id}
            productPrice={displayedPrice}
            variantId={selectedVariant?.id || ""}
            className="mt-10"
            productName={product.name}
            variantColor={selectedVariant?.color || ""}
            variantSize={selectedVariant?.size || ""}
            image={
              product.images.find((img) => img.place === "front")?.url ||
              product.images[0]?.url ||
              ""
            }
            quantity={1}
            // itemType={product.type}
          />
          <Button>
            <Link href={`/editor/${product.id}`}>Customize</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
