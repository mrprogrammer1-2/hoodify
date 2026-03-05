"use server";

import { db } from "@/db";
import { productImages, products, productVariants } from "@/db/schemas";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const type = formData.get("type") as "hoodie" | "ticket";

  const images = JSON.parse((formData.get("images") as string) || "[]") as {
    url: string;
    place?: "front" | "back";
    color?: string;
    position?: number;
  }[];

  const variants = JSON.parse((formData.get("variants") as string) || "[]");

  // 1️⃣ Create product
  const [product] = await db
    .insert(products)
    .values({
      name,
      price,
      type,
    })
    .returning();

  // 2️⃣ Insert Images (FIXED)
  if (images.length) {
    await db.insert(productImages).values(
      images.map((image, index) => ({
        productId: product.id,
        url: image.url, // ✅ only URL string
        place: image.place ?? null, // ✅ store place
        color: image.color ?? null, // ✅ store color
        position: image.position ?? index,
      })),
    );
  }

  // 3️⃣ Insert Variants (unchanged)
  if (variants.length) {
    await db.insert(productVariants).values(
      variants.map((variant: any) => ({
        productId: product.id,
        color: variant.color,
        size: variant.size || null,
        stock: variant.stock,
        price: variant.price ?? null,
      })),
    );
  }

  return { success: true };
}
