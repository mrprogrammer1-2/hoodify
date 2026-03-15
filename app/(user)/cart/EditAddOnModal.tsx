"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AddOn, useCartStore } from "@/stores/cart-store";
import { editAddOn } from "@/lib/actions/updateOrderStatus";

export default function EditAddOnModal({
  selectedAddons,
  variantId,
  productId,
  onClose,
}: {
  selectedAddons: AddOn[];
  variantId: string;
  productId: string;
  onClose: () => void;
}) {
  const [editedAddons, setEditedAddons] = useState<AddOn[]>(selectedAddons);
  const updateAddOns = useCartStore((state) => state.updateAddOns);

  const handleTextChange = (id: string, newValue: string) => {
    setEditedAddons((prev) =>
      prev.map((addon) =>
        addon.id === id ? { ...addon, text: newValue } : addon,
      ),
    );
  };

  const handleSave = async () => {
    await editAddOn(variantId, productId, editedAddons);
    updateAddOns(productId, variantId, editedAddons);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Add-ons</h2>
        {editedAddons.map((addon) => (
          <div key={addon.id} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {addon.name}
            </label>
            <Input
              type="text"
              value={addon.text || ""}
              onChange={(e) => handleTextChange(addon.id, e.target.value)}
              placeholder="Add special instructions"
            />
          </div>
        ))}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
