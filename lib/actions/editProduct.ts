"use server";
import { products, productImages, productVariants } from "@/db/schemas";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function editProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const type = formData.get("type") as "hoodie" | "ticket";
  const featured = formData.get("featured") === "on";
  const isCustomizable = formData.get("isCustomizable") === "on";

  const images = JSON.parse((formData.get("images") as string) || "[]") as {
    url: string;
    place?: "front" | "back" | "left-sleeve" | "right-sleeve";
    color?: string;
    position?: number;
  }[];

  const variants = JSON.parse((formData.get("variants") as string) || "[]") as {
    color: string;
    size?: string;
    stock: number;
    price?: number;
  }[];

  await db
    .update(products)
    .set({ name, price, type, featured, isCustomizable })
    .where(eq(products.id, id));

  await db.delete(productImages).where(eq(productImages.productId, id));
  await db.delete(productVariants).where(eq(productVariants.productId, id));

  if (images.length) {
    await db.insert(productImages).values(
      images.map((image, index) => ({
        productId: id,
        url: image.url,
        place: image.place ?? null,
        color: image.color ?? null,
        position: image.position ?? index,
      })),
    );
  }

  if (variants.length) {
    await db.insert(productVariants).values(
      variants.map((variant) => ({
        productId: id,
        color: variant.color,
        size: variant.size || null,
        stock: variant.stock,
        price: variant.price ?? null,
      })),
    );
  }
}
