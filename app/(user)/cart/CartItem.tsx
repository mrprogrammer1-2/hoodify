import Image from "next/image";
import { QuantityControl } from "@/app/(user)/cart/QuantityControl";

type CartItemProps = {
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  //   customization?: { designUrl?: string };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItem({
  name,
  image,
  price,
  quantity,
  color,
  size,
  //   customization,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-4 border rounded-xl p-4 min-w-full">
      {/* Product Image */}
      <div className="relative w-24 h-24">
        <Image
          src={image}
          alt={name}
          fill
          loading="eager"
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold">{name}</h3>

        <p className="text-sm text-gray-500">
          {color && `Color: ${color}`} {size && ` | Size: ${size}`}
        </p>

        {/* {customization?.designUrl && (
          <p className="text-sm text-blue-600">Custom design added</p>
        )} */}

        <div className="flex items-center justify-between mt-3">
          <span className="font-medium">${price * quantity}</span>

          <div className="flex items-center gap-4">
            <QuantityControl
              quantity={quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />
            <button
              onClick={onRemove}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
