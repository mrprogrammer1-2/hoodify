"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import UploadProductImage from "../../components/UploadProductImage";
import { createProduct } from "@/lib/actions/createProduct";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";

export function ProductForm() {
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ProductImageInput[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);

  function clearForm(result: boolean) {
    if (result) {
      setImages([]);
      setVariants([]);
      formRef.current?.reset();
      const firstInput =
        formRef.current?.querySelector<HTMLInputElement>('input[name="name"]');
      firstInput?.focus();
    }
  }

  function action(formData: FormData) {
    startTransition(async () => {
      const result = await createProduct(formData);

      if (result.success) {
        toast.success("Product created successfully");
        clearForm(true);
      } else {
        toast.error("Failed to create product");
      }
    });
  }

  return (
    <form
      action={action}
      ref={formRef}
      className="max-w-2xl mx-auto space-y-8 p-8 bg-white dark:bg-zinc-900
                 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create Product
        </h2>
        <p className="text-sm text-muted-foreground">
          Add a new product and manage its images and variants.
        </p>
      </div>

      {/* Hidden Inputs */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />

      {/* Product Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Product Name</label>
        <input
          name="name"
          required
          placeholder="Premium Hoodie"
          className="w-full rounded-lg border border-input bg-background px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Price + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <input
            name="price"
            type="number"
            required
            placeholder="1999"
            className="w-full rounded-lg border border-input bg-background px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Product Type</label>
          <select
            name="type"
            defaultValue="hoodie"
            className="w-full rounded-lg border border-input bg-background px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="hoodie">Hoodie</option>
            <option value="ticket">Ticket</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted transition">
          <input type="checkbox" name="featured" />
          <div>
            <p className="text-sm font-medium">Featured product</p>
            <p className="text-xs text-muted-foreground">
              Highlight on homepage
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted transition">
          <input type="checkbox" name="isCustomizable" />
          <div>
            <p className="text-sm font-medium">Customizable</p>
            <p className="text-xs text-muted-foreground">
              User can customize this product
            </p>
          </div>
        </label>
      </div>

      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Product Images</h3>
            <p className="text-xs text-muted-foreground">
              Upload images and assign placement
            </p>
          </div>
          <UploadProductImage
            onUpload={(url) =>
              setImages((prev) => [
                ...prev,
                {
                  url,
                  place: "front",
                  color: "",
                  position: prev.length,
                },
              ])
            }
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={image.url} className="rounded-xl border p-4 space-y-3">
                <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt="Product image"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <select
                  value={image.place}
                  onChange={(e) => {
                    const copy = [...images];
                    copy[index].place = e.target
                      .value as ProductImageInput["place"];
                    setImages(copy);
                  }}
                  className="w-full rounded border px-2 py-1"
                >
                  <option value="front">Front</option>
                  <option value="back">Back</option>
                  <option value="left-sleeve">Left Sleeve</option>
                  <option value="right-sleeve">Right Sleeve</option>
                </select>

                <input
                  placeholder="Color (optional)"
                  value={image.color ?? ""}
                  onChange={(e) => {
                    const copy = [...images];
                    copy[index].color = e.target.value;
                    setImages(copy);
                  }}
                  className="w-full rounded border px-2 py-1"
                />

                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500 text-sm"
                >
                  Remove Image
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Variants Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Variants</h3>
          <p className="text-xs text-muted-foreground">
            Define color, size, stock and optional price override
          </p>
        </div>

        {variants.map((variant, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 border p-3 rounded"
          >
            <input
              placeholder="Color"
              value={variant.color}
              onChange={(e) => {
                const copy = [...variants];
                copy[index].color = e.target.value;
                setVariants(copy);
              }}
              className="rounded border px-2 py-1"
            />
            <input
              placeholder="Size"
              value={variant.size ?? ""}
              onChange={(e) => {
                const copy = [...variants];
                copy[index].size = e.target.value;
                setVariants(copy);
              }}
              className="rounded border px-2 py-1"
            />
            <input
              type="number"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) => {
                const copy = [...variants];
                copy[index].stock = Number(e.target.value);
                setVariants(copy);
              }}
              className="rounded border px-2 py-1"
            />
            <input
              type="number"
              placeholder="Price"
              value={variant.price ?? ""}
              onChange={(e) => {
                const copy = [...variants];
                copy[index].price = Number(e.target.value);
                setVariants(copy);
              }}
              className="rounded border px-2 py-1"
            />
            <button
              type="button"
              onClick={() =>
                setVariants((prev) => prev.filter((_, i) => i !== index))
              }
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setVariants((prev) => [...prev, { color: "", size: "", stock: 0 }])
          }
          className="text-sm underline"
        >
          + Add variant
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-primary px-6 py-3 text-primary-foreground
                   font-medium hover:bg-primary/90 transition
                   disabled:opacity-50"
      >
        {isPending ? <Spinner /> : "Create product"}
      </button>
    </form>
  );
}
