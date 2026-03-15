"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/createOrder";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import * as fabric from "fabric";

type View = "front" | "back" | "left-sleeve" | "right-sleeve";

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

type AddOn = {
  id: string;
  name: string;
  price: number;
  text?: string;
};

type AddToCartButtonProps = {
  orderId?: string;
  productId: string;
  variantId?: string;
  productName: string;
  productPrice: number;
  variantColor?: string;
  variantSize?: string;
  quantity?: number;
  image: string;
  className?: string;
  fabricRef?: React.MutableRefObject<fabric.Canvas | null>;
  currentView?: View;
  designs?: Record<View, string | null>;
  addOns?: AddOn[];
};

const compressImage = (dataUrl: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = dataUrl;
  });
};

const uploadToCloudinary = async (dataUrl: string): Promise<string> => {
  const compressed = await compressImage(dataUrl);

  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("upload_preset", "hoodify");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`);
  const data = await res.json();
  return data.secure_url;
};

const extractTextDetails = (json: string): TextDetail[] => {
  try {
    const parsed = JSON.parse(json);
    const textTypes = ["Textbox", "IText", "Text"];

    return (parsed.objects ?? [])
      .filter((obj: any) => textTypes.includes(obj.type))
      .map((obj: any) => ({
        text: obj.text ?? "",
        fontFamily: obj.fontFamily ?? "Arial",
        fontSize: obj.fontSize ?? 16,
        fontWeight: obj.fontWeight ?? "normal",
        fill: obj.fill ?? "#000000",
      }));
  } catch {
    return [];
  }
};

const exportViewAsImage = (
  sourceCanvas: fabric.Canvas,
  json: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const offscreenEl = document.createElement("canvas");
    offscreenEl.width = sourceCanvas.width || 800;
    offscreenEl.height = sourceCanvas.height || 800;

    const tempCanvas = new fabric.Canvas(offscreenEl);
    tempCanvas.loadFromJSON(json, () => {
      tempCanvas.renderAll();
      setTimeout(() => {
        try {
          const dataUrl = tempCanvas.toDataURL({
            format: "png",
            multiplier: 1,
          });
          tempCanvas.dispose();
          resolve(dataUrl);
        } catch (err) {
          tempCanvas.dispose();
          reject(err);
        }
      }, 150);
    });
  });
};

export function AddToCartButton({
  productId,
  variantId,
  productName,
  productPrice,
  variantColor,
  variantSize,
  quantity = 1,
  image,
  className,
  fabricRef,
  currentView,
  designs,
  addOns = [],
}: AddToCartButtonProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useKindeBrowserClient();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const canAddToCart = Boolean(variantColor && variantSize);

  const handleAddToCart = async () => {
    if (!canAddToCart || isAdding) return;
    setIsAdding(true);

    try {
      const customization: Record<string, ViewCustomization> = {};

      if (fabricRef?.current && designs) {
        const canvas = fabricRef.current;

        if (currentView) {
          designs[currentView] = JSON.stringify(canvas.toJSON());
        }

        const viewsWithDesigns = (
          ["front", "back", "left-sleeve", "right-sleeve"] as View[]
        ).filter((v) => !!designs[v]);

        const exportedImages: Record<string, string> = {};
        for (const view of viewsWithDesigns) {
          exportedImages[view] = await exportViewAsImage(
            canvas,
            designs[view]!,
          );
        }

        await Promise.all(
          Object.entries(exportedImages).map(async ([view, dataUrl]) => {
            const [imageUrl, texts] = await Promise.all([
              uploadToCloudinary(dataUrl),
              Promise.resolve(extractTextDetails(designs[view as View]!)),
            ]);

            customization[view] = { imageUrl, texts };
          }),
        );
      }

      addToCart({
        productId,
        variantId,
        productName,
        productPrice,
        variantColor,
        variantSize,
        quantity,
        image,
        addOns,
      });

      if (isAuthenticated && variantSize && variantColor) {
        await createOrder({
          productId,
          size: variantSize,
          color: variantColor,
          customization:
            Object.keys(customization).length > 0
              ? JSON.stringify(customization)
              : undefined,
          addOn: addOns.length > 0 ? JSON.stringify(addOns) : undefined,
        });
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!canAddToCart || isAdding}
      className={className}
    >
      {isAdding ? (
        <Plus className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isAdding ? "Adding..." : added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
