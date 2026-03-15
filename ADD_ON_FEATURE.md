# Add-On Feature Implementation

## Overview
Customers can now add customizable add-ons (like patches with custom text) to their hoodie orders.

## Changes Made

### 1. **Cart Store** (`stores/cart-store.ts`)
- Added `AddOn` type with `id`, `name`, `price`, and optional `text` fields
- Updated `CartItem` type to include `addOns?: AddOn[]`
- Added `updateAddOns` method to update add-ons for a cart item
- Updated `subtotal()` to include add-on prices in calculations
- Fixed `incrementQuantity` and `decrementQuantity` to use both `productId` and `variantId`

### 2. **Add-On Selector Component** (`components/AddOnSelector.tsx`)
- New component for selecting and customizing add-ons
- Displays available add-ons with prices
- Allows custom text input for patches (e.g., "الي مالا نهاية")
- Shows selected add-ons with their details
- Handles adding/removing add-ons

### 3. **Add To Cart Button** (`components/AddToCartButton.tsx`)
- Updated to accept `addOns` parameter
- Passes add-ons to `createOrder` action as JSON string
- Includes add-ons in cart store when adding items

### 4. **Cart Item Display** (`app/(user)/cart/CartItem.tsx`)
- Shows selected add-ons with their names and prices
- Displays custom text for patches
- Calculates total price including add-ons

### 5. **Cart Client Page** (`app/(user)/cart/CartClientPage.tsx`)
- Updated to pass `addOns` to `CartItem` component
- Fixed quantity increment/decrement to use variant ID

### 6. **Create Order Action** (`lib/actions/createOrder.ts`)
- Updated to accept `addOn` parameter
- Stores add-ons in database as JSON in `orderItems.addOn` field
- Treats items with add-ons as unique (doesn't merge with existing items)

### 7. **Product Page** (`app/(user)/shop/[productId]/SingleProductClient.tsx`)
- Integrated `AddOnSelector` component
- Shows add-ons section when size and color are selected
- Passes selected add-ons to `AddToCartButton`
- Sample add-ons included (Embroidered Patch, Woven Patch, Enamel Pin)

## Database Schema
The `orderItems` table already has the `addOn` field (JSONB type) to store add-on data.

## Usage Example

```typescript
// Add-on structure stored in database
{
  "id": "patch-1",
  "name": "Embroidered Patch",
  "price": 5,
  "text": "الي مالا نهاية"
}
```

## Customization

To add more add-ons, update the `AVAILABLE_ADD_ONS` array in `SingleProductClient.tsx`:

```typescript
const AVAILABLE_ADD_ONS = [
  { id: "patch-1", name: "Embroidered Patch", price: 5, allowCustomText: true },
  { id: "patch-2", name: "Woven Patch", price: 7, allowCustomText: true },
  { id: "pin", name: "Enamel Pin", price: 3, allowCustomText: false },
  // Add more here
];
```

## Features
✅ Select multiple add-ons per hoodie
✅ Custom text input for patches
✅ Add-on prices included in cart total
✅ Add-ons stored in database
✅ Display add-ons in cart and order summary
✅ Support for Arabic text (e.g., "الي مالا نهاية")
