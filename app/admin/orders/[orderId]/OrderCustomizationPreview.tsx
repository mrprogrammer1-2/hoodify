"use client";

// import OrderCanvas from "./OrderCanvas";

type ProductImage = {
  url: string;
  place: string;
};

type OrderItem = {
  customization: Record<string, any>;
  product: {
    images: ProductImage[];
  };
};

const labelMap: Record<string, string> = {
  front: "Front",
  back: "Back",
  rightSleeve: "Right Sleeve",
  leftSleeve: "Left Sleeve",
};

export default function OrderCustomizationPreview({
  item,
}: {
  item: OrderItem;
}) {
  const customizations = Object.entries(item.customization || {}).filter(
    ([_, value]) => value !== null,
  );

  if (!customizations.length) {
    return (
      <p className="text-sm text-gray-500">
        No customization for this product.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {customizations.map(([place, customization]) => {
        const productImage = item.product.images.find(
          (img) => img.place === place,
        )?.url;

        return (
          <div key={place} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">
              {labelMap[place] || place}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
