import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AddOn = {
  id: string;
  name: string;
  price: number;
  text?: string;
};

type CartItem = {
  orderId?: string;
  productId: string;
  variantId?: string;
  productName: string;
  productPrice: number;
  variantColor?: string;
  variantSize?: string;
  quantity?: number;
  className?: string;
  image: string;
  addOns?: AddOn[];
};

type CartState = {
  items: CartItem[];
  isHydrated: boolean;
  addToCart: (items: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  incrementQuantity: (productId: string, variantId?: string, addOns?: AddOn[]) => void;
  decrementQuantity: (productId: string, variantId?: string, addOns?: AddOn[]) => void;
  getTotalItems: () => number;
  clearCart: () => void;
  subtotal: () => number;
  setItemsFromServer: (items: CartItem[]) => void;
  setHydrated: () => void;
  updateAddOns: (productId: string, variantId: string | undefined, addOns: AddOn[]) => void;
};

const addOnsToString = (addOns?: AddOn[]): string => {
  if (!addOns || addOns.length === 0) return "";
  return JSON.stringify(addOns.map(a => ({ id: a.id, text: a.text })).sort((a, b) => a.id.localeCompare(b.id)));
};

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      isHydrated: false,
      addToCart: (item) =>
        set((state) => {
          const addOnsKey = addOnsToString(item.addOns);
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              addOnsToString(i.addOns) === addOnsKey,
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity! + 1,
            };
            return { items: updatedItems };
          } else {
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }
        }),
      removeFromCart: (item) =>
        set((state) => {
          const addOnsKey = addOnsToString(item.addOns);
          return {
            items: state.items.filter(
              (i) =>
                i.productId !== item.productId ||
                i.variantId !== item.variantId ||
                addOnsToString(i.addOns) !== addOnsKey,
            ),
          };
        }),
      clearCart: () => {
        set({ items: [] });
        localStorage.removeItem("cart-storage");
      },

      incrementQuantity: (productId, variantId, addOns) =>
        set((state) => {
          const addOnsKey = addOnsToString(addOns);
          return {
            items: state.items.map((item) =>
              item.productId === productId &&
              item.variantId === variantId &&
              addOnsToString(item.addOns) === addOnsKey
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item,
            ),
          };
        }),
      decrementQuantity: (productId, variantId, addOns) =>
        set((state) => {
          const addOnsKey = addOnsToString(addOns);
          return {
            items: state.items.map((item) =>
              item.productId === productId &&
              item.variantId === variantId &&
              addOnsToString(item.addOns) === addOnsKey
                ? {
                    ...item,
                    quantity: Math.max(1, (item.quantity || 1) - 1),
                  }
                : item,
            ),
          };
        }),

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity!, 0);
      },
      subtotal: () =>
        get().items.reduce((total, item) => {
          const itemPrice = item.productPrice * item.quantity!;
          const addOnsPrice = (item.addOns || []).reduce((sum, addon) => sum + addon.price, 0);
          return total + itemPrice + addOnsPrice;
        }, 0),
      setItemsFromServer: (items) => {
        set({ items });
      },

      setHydrated: () => set({ isHydrated: true }),

      updateAddOns: (productId, variantId, addOns) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, addOns }
              : item,
          ),
        })),
    }),
    {
      name: "cart-storage",
    },
  ),
);
