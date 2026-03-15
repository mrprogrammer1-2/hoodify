"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { AddOn } from "@/stores/cart-store";

type AddOnSelectorProps = {
  selectedAddOns: AddOn[];
  onAddOnsChange: (addOns: AddOn[]) => void;
};

const PATCH_ADD_ON: AddOn = {
  id: "patch",
  name: "Add Patch",
  price: 50,
};

export function AddOnSelector({
  selectedAddOns,
  onAddOnsChange,
}: AddOnSelectorProps) {
  const [patchText, setPatchText] = useState("");
  const hasPatch = selectedAddOns.some((a) => a.id === "patch");

  const handlePatchChange = (checked: boolean) => {
    if (checked) {
      onAddOnsChange([...selectedAddOns, { ...PATCH_ADD_ON, text: patchText }]);
    } else {
      onAddOnsChange(selectedAddOns.filter((a) => a.id !== "patch"));
      setPatchText("");
    }
  };

  const handleTextChange = (text: string) => {
    setPatchText(text);
    if (hasPatch) {
      onAddOnsChange(
        selectedAddOns.map((a) =>
          a.id === "patch" ? { ...a, text } : a
        )
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Checkbox
          id="patch"
          checked={hasPatch}
          onCheckedChange={handlePatchChange}
        />
        <label htmlFor="patch" className="font-medium cursor-pointer">
          Add Patch (+{PATCH_ADD_ON.price} EGP)
        </label>
      </div>

      {hasPatch && (
        <Input
          placeholder="Enter text for patch (e.g., الي مالا نهاية)"
          value={patchText}
          onChange={(e) => handleTextChange(e.target.value)}
          className="ml-6"
        />
      )}
    </div>
  );
}
