import { create } from "zustand";
import { persist } from "zustand/middleware";

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
};

type CartState = {
  items: CartItem[];
  isHydrated: boolean;
  addToCart: (items: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  getTotalItems: () => number;
  clearCart: () => void;
  subtotal: () => number;
  setItemsFromServer: (items: CartItem[]) => void;
  setHydrated: () => void;
};

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      isHydrated: false,
      addToCart: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId && i.variantId === item.variantId,
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
        set((state) => ({
          items: state.items.filter(
            (i) =>
              i.productId !== item.productId || i.variantId !== item.variantId,
          ),
        })),
      clearCart: () => {
        set({ items: [] });
        localStorage.removeItem("cart-storage");
      },

      incrementQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item,
          ),
        })),
      decrementQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: Math.max(1, (item.quantity || 1) - 1),
                }
              : item,
          ),
        })),

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity!, 0);
      },
      subtotal: () =>
        get().items.reduce(
          (total, item) => total + item.productPrice * item.quantity!,
          0,
        ),
      setItemsFromServer: (items) => {
        set({ items });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
