import { Button } from "@/components/ui/button";
import * as fabric from "fabric";
import { createOrder } from "@/lib/actions/createOrder";
import { useState } from "react";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  // canvas: fabric.Canvas | null;
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  product: {
    images: {
      id: string;
      productId: string;
      url: string;
      altText: string | null;
      color: string | null;
      position: number | null;
      place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
    }[];
    variants: {
      id: string;
      productId: string;
      color: string;
      size: string | null;
      stringColor: string | null;
      stock: number | null;
      price: number | null;
    }[];
    id: string;
    name: string;
    description: string | null;
    price: number;
    type: "hoodie" | "ticket";
    featured: boolean;
    isCustomizable: boolean;
    isActive: boolean | null;
    createdAt: Date;
  };

  currentView: View;
  designs: Record<View, string | null>;
  setDesigns: React.Dispatch<React.SetStateAction<Record<View, string | null>>>;
};

export default function CanvasContainer({
  canvasRef,
  fabricRef,
  product,
  currentView,
  designs,
  setDesigns,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a size and color first");
      return;
    }

    setIsSaving(true);

    // Save current view before adding to cart
    if (fabricRef.current) {
      const objectsOnly = fabricRef.current.getObjects().map((o) => o.toJSON());
      const updatedDesigns = {
        ...designs,
        [currentView]: JSON.stringify({ objects: objectsOnly }),
      };

      // Find selected variant details
      const variant = product.variants.find((v) => v.id === selectedVariant);

      if (variant) {
        await createOrder({
          productId: product.id,
          size: variant.size!,
          color: variant.color,
          customization: updatedDesigns,
        });

        alert("Added to cart!");
      }
    }

    setIsSaving(false);
  };

  return (
    <div className="flex flex-col flex-5">
      <div id="canvas" className="min-h-dvh select-none bg-gray-400">
        <canvas ref={canvasRef} className="select-none" />
      </div>

      <div className="p-4 border-t">
        {/* Add variant selector here */}
        <Button
          onClick={handleSaveToCart}
          disabled={isSaving || !selectedVariant}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
