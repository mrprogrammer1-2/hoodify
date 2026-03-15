"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PRICING_CONFIG } from "@/lib/pricing";

export default function PricingSettings() {
  const [patchPrice, setPatchPrice] = useState(
    PRICING_CONFIG.addOns.patch.basePrice
  );
  const [customizationPerSide, setCustomizationPerSide] = useState(
    PRICING_CONFIG.customization.perSide
  );
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // In a real app, you'd send this to an API endpoint
    console.log("Saving pricing config:", {
      patchPrice,
      customizationPerSide,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e1019] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pricing Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage prices for customization and add-ons (in EGP)
          </p>
        </div>

        {/* Add-ons Pricing */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add-ons Pricing
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patch Price
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">EGP</span>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={patchPrice}
                  onChange={(e) => setPatchPrice(parseInt(e.target.value) || 0)}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">
                Price charged when customer adds a patch to their order
              </p>
            </div>
          </div>
        </Card>

        {/* Customization Pricing */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Customization Pricing
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Per Side
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">EGP</span>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={customizationPerSide}
                  onChange={(e) =>
                    setCustomizationPerSide(parseInt(e.target.value) || 0)
                  }
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">
                Price charged per side customized (front, back, left-sleeve,
                right-sleeve)
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <span className="font-semibold">Example:</span> If a customer
                customizes 2 sides at {customizationPerSide} EGP per side, they pay
                an additional {customizationPerSide * 2} EGP
              </p>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6 bg-gray-100 dark:bg-white/[0.05]">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Current Pricing Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Patch add-on:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {patchPrice} EGP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Customization per side:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {customizationPerSide} EGP
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-white/[0.1]">
              <span className="text-gray-600 dark:text-gray-400">
                Max customization (4 sides):
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {customizationPerSide * 4} EGP
              </span>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            {saved ? "✓ Saved" : "Save Changes"}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-lg p-4">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <span className="font-semibold">Note:</span> These prices are added
            to the base product price. For example, a 500 EGP hoodie with 2 sides
            customized and a patch would cost: 500 + ({customizationPerSide} × 2) + {patchPrice} = {500 + (customizationPerSide * 2) + patchPrice} EGP
          </p>
        </div>
      </div>
    </div>
  );
}
