import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { products } from "@/db/schemas";
import { z } from "zod";

// Matches productImages table columns (excluding productId, that's added server-side)
const imageSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url("Each image must be a valid URL"),
  altText: z.string().optional(),
  color: z.string().optional(),
  position: z.number().default(0),
  place: z.enum(["front", "back", "left-sleeve", "right-sleeve"]).optional(),
});

// Matches productVariants table columns (excluding productId)
const variantSchema = z.object({
  id: z.string().uuid().optional(),
  color: z.string().min(1, "Color is required"),
  size: z.string().optional(),
  stringColor: z.string().optional(),
  stock: z.number().default(0),
  price: z.number().optional(),
});

export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.min(1, "Product name is required"),
  description: (schema) => schema.min(1, "Description is required"),
  price: (schema) => schema.positive("Price must be a positive number"),
  //   type: (schema) => schema.min(1, "Product type is required"),
}).extend({
  images: z.array(imageSchema).min(1, "At least one image is required"),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

// Schema for selected products with related data (images and variants)
export const selectProductSchema = createSelectSchema(products).extend({
  images: z.array(imageSchema),
  variants: z.array(variantSchema),
});

export type insertProductSchemaType = z.infer<typeof insertProductSchema>;
export type selectProductSchemaType = z.infer<typeof selectProductSchema>;
