import { db } from "@/db";
import { productImages, products, productVariants } from "@/db/schemas";
import { eq, ilike, or, sql, and } from "drizzle-orm";

export async function getHoodies() {
  const rows = await db
    .select({
      productId: products.id,
      name: products.name,
      price: products.price,
      type: products.type,

      imageId: productImages.id,
      imageUrl: productImages.url,
      imagePlace: productImages.place,
      imageColor: productImages.color,
      imagePosition: productImages.position,

      variantId: productVariants.id,
      variantColor: productVariants.color,
      variantSize: productVariants.size,
      variantStock: productVariants.stock,
      variantPrice: productVariants.price,
    })
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .where(eq(products.type, "hoodie"));

  // 🔥 GROUP DATA
  const productsMap = new Map();

  for (const row of rows) {
    if (!productsMap.has(row.productId)) {
      productsMap.set(row.productId, {
        id: row.productId,
        name: row.name,
        price: row.price,
        type: row.type,
        images: [],
        variants: [],
      });
    }

    const product = productsMap.get(row.productId);

    // Add image (avoid duplicates)
    if (
      row.imageId &&
      !product.images.some((img: any) => img.id === row.imageId)
    ) {
      product.images.push({
        id: row.imageId,
        url: row.imageUrl,
        place: row.imagePlace,
        color: row.imageColor,
        position: row.imagePosition,
      });
    }

    // Add variant (avoid duplicates)
    if (
      row.variantId &&
      !product.variants.some((v: any) => v.id === row.variantId)
    ) {
      product.variants.push({
        id: row.variantId,
        color: row.variantColor,
        size: row.variantSize,
        stock: row.variantStock,
        price: row.variantPrice,
      });
    }
  }

  return Array.from(productsMap.values());
}

export const getTickets = async () => {
  const tickets = await db
    .select()
    .from(products)
    .where(eq(products.type, "ticket"));
  return tickets;
};

export const getProductById = async (id: string) => {
  const productFromDb = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      type: products.type,
      featured: products.featured,
      isCustomizable: products.isCustomizable,
      isActive: products.isActive,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.id, id));

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id));

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id));

  return { ...productFromDb[0], images, variants };
};

export async function getAllProducts(search?: string) {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        sql`${products.type}::text ILIKE ${`%${search}%`}`,
      ),
    );
  }

  const rows = await db
    .select({
      productId: products.id,
      name: products.name,
      price: products.price,
      type: products.type,
      createdAt: products.createdAt,

      imageId: productImages.id,
      imageUrl: productImages.url,
      imagePlace: productImages.place,
      imageColor: productImages.color,
      imagePosition: productImages.position,

      variantId: productVariants.id,
      variantColor: productVariants.color,
      variantSize: productVariants.size,
      variantStock: productVariants.stock,
      variantPrice: productVariants.price,
    })
    .from(products)
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(productVariants, eq(products.id, productVariants.productId))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const productsMap = new Map();

  for (const row of rows) {
    if (!productsMap.has(row.productId)) {
      productsMap.set(row.productId, {
        id: row.productId,
        name: row.name,
        price: row.price,
        type: row.type,
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : row.createdAt,
        images: [],
        variants: [],
      });
    }

    const product = productsMap.get(row.productId);

    if (
      row.imageId &&
      !product.images.some((img: any) => img.id === row.imageId)
    ) {
      product.images.push({
        id: row.imageId,
        url: row.imageUrl,
        place: row.imagePlace,
        color: row.imageColor,
        position: row.imagePosition,
      });
    }

    if (
      row.variantId &&
      !product.variants.some((v: any) => v.id === row.variantId)
    ) {
      product.variants.push({
        id: row.variantId,
        color: row.variantColor,
        size: row.variantSize,
        stock: row.variantStock,
        price: row.variantPrice,
      });
    }
  }

  return Array.from(productsMap.values());
}
