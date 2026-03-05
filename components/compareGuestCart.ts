type Props = {
  cart: {
    image: string;
    // itemType: string;
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    variantColor: string;
    variantId: string;
    variantSize: string;
  }[];
  items: {
    // orderItemId: string;
    productId: string;
    variantId?: string;
    productName: string;
    productPrice: number;
    variantColor?: string;
    variantSize?: string;
    quantity?: number;
    // itemType?: "product" | "customization" | "addon";
    // customization?: Record<string, any>;
    className?: string;
    image: string;
  }[];
};

export default async function compareGuestCart({ cart, items }: Props) {
  console.log(cart);
  // clone user cart so we don't mutate original
  const mergedCart = [...items];

  for (const guestItem of cart) {
    const existingItemIndex = mergedCart.findIndex(
      (userItem) =>
        userItem.productId === guestItem.productId &&
        userItem.variantId === guestItem.variantId,
      // userItem.itemType === guestItem.itemType,
    );

    if (existingItemIndex !== -1) {
      // item exists → increase quantity
      mergedCart[existingItemIndex].quantity =
        (mergedCart[existingItemIndex].quantity ?? 0) + guestItem.quantity;
    } else {
      // item does not exist → add it
      mergedCart.push({
        productId: guestItem.productId,
        variantId: guestItem.variantId,
        productName: guestItem.productName,
        productPrice: guestItem.productPrice,
        variantColor: guestItem.variantColor,
        variantSize: guestItem.variantSize,
        quantity: guestItem.quantity,
        // itemType: guestItem.itemType as "product" | "customization" | "addon",
        image: guestItem.image,
      });
    }
  }

  return mergedCart;
}
