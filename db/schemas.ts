import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  pgEnum,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  kindeId: text("kinde_id").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  type: text("type", { enum: ["hoodie", "ticket"] }).notNull(),
  featured: boolean("featured").notNull().default(false),
  isCustomizable: boolean("is_customizable").notNull().default(false),
  isActive: boolean().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ImagePlaceEnum = pgEnum("place", [
  "front",
  "back",
  "left-sleeve",
  "right-sleeve",
]);
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  color: text("color"),
  position: integer("position").default(0),
  place: ImagePlaceEnum("place"),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  color: text("color").notNull(),
  size: text("size"),
  stringColor: text("string_color"),
  stock: integer("stock").default(0), // stock means quantity available
  price: integer("price"),
});

// Define an enum for order status
export const orderStatusEnum = pgEnum("order_status", [
  "cart",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// Define an enum for item type
export const itemTypeEnum = pgEnum("item_type", ["hoodie", "ticket"]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }), // Foreign key to users
  status: orderStatusEnum("status").notNull().default("cart"),
  totalPrice: integer("total_price").default(0).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("EGP"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    variantId: uuid("variant_id").references(() => productVariants.id),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: integer("unit_price").notNull(),
    // itemType: itemTypeEnum("item_type").notNull(),
    customization: jsonb("customization"),
  },
  (t) => ({
    uniqueCartItem: unique().on(
      t.orderId,
      t.productId,
      t.variantId,
      // t.itemType,
    ),
  }),
);

export const userRelations = relations(usersTable, ({ many }) => ({
  orders: many(orders),
}));

export const productRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  variants: many(productVariants),
}));

export const productVariantRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ many, one }) => ({
  user: one(usersTable, {
    fields: [orders.userId],
    references: [usersTable.id],
  }),
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
