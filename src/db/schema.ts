import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const id = t.uuid('id').defaultRandom().primaryKey();

export const createdAt = t
  .timestamp('created_at', { withTimezone: true, mode: 'date' })
  .notNull()
  .defaultNow();

export const updatedAt = t
  .timestamp('updated_at', { withTimezone: true, mode: 'date' })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const userRoles = t.pgEnum('userRoles', ['admin', 'customer']);

export const orderStatus = t.pgEnum('orderStatus', [
  'pending',
  'paid',
  'cancelled',
]);

export const UserTable = t.pgTable('users', {
  id,
  name: t.varchar('name', { length: 255 }),
  email: t.varchar('email', { length: 255 }),
  clerkUserId: t.varchar('clerk_user_id', { length: 255 }).notNull().unique(),
  imageUrl: t.varchar('image_url'),
  role: userRoles('role').default('customer').notNull(),
  createdAt,
  updatedAt,
});

export const ShippingAddressTable = t.pgTable('shipping_addresses', {
  id,
  userId: t
    .uuid('user_id')
    .references(() => UserTable.id, { onDelete: 'no action' })
    .notNull(),
  address1: t.varchar('address1', { length: 255 }),
  address2: t.varchar('address2', { length: 255 }),
  city: t.varchar('city', { length: 255 }),
  state: t.varchar('state', { length: 255 }),
  zip: t.varchar('zip', { length: 255 }),
  country: t.varchar('country', { length: 255 }),
  isDefault: t.boolean('is_default'),
  createdAt,
  updatedAt,
});

export const CategoryTable = t.pgTable('categories', {
  id,
  name: t.varchar('name', { length: 255 }),
  createdAt,
  updatedAt,
});

export const ProductTable = t.pgTable('products', {
  id,
  name: t.varchar('name', { length: 255 }),
  priceInCents: t.integer('price_in_cents').notNull(),
  body: t.text('body'),
  categoryId: t
    .uuid('category_id')
    .references(() => CategoryTable.id, { onDelete: 'no action' })
    .notNull(),
  stock: t.integer().notNull().default(0),
  slug: t.varchar('slug', { length: 255 }).notNull().unique(),
  createdAt,
  updatedAt,
});

export const ProductImageTable = t.pgTable('product_images', {
  id,
  productId: t
    .uuid('product_id')
    .references(() => ProductTable.id, { onDelete: 'cascade' })
    .notNull(),
  imageUrl: t.varchar('image_url', { length: 255 }),
  createdAt,
  updatedAt,
});

export const OrderTable = t.pgTable('orders', {
  id,
  userId: t
    .uuid('user_id')
    .references(() => UserTable.id)
    .notNull(),
  totalInCents: t.integer('total_in_cents'),
  stripeCheckoutSessionId: t.varchar('stripe_checkout_session_id', {
    length: 255,
  }),
  shippingAddressId: t
    .uuid('shipping_address_id')
    .references(() => ShippingAddressTable.id, { onDelete: 'no action' })
    .notNull(),
  status: orderStatus('status').default('pending').notNull(),
  metadata: t.jsonb('metadata').default({ shipping_address: '' }),
  createdAt,
  updatedAt,
});

export const OrderItemTable = t.pgTable('order_items', {
  id,
  productId: t
    .uuid('product_id')
    .references(() => ProductTable.id, { onDelete: 'no action' })
    .notNull(),
  priceAtPurchaseInCents: t.integer('price_at_purchase_in_cents').notNull(),
  quantity: t.integer().notNull().default(1),
  orderId: t
    .uuid('order_id')
    .references(() => OrderTable.id, { onDelete: 'no action' })
    .notNull(),
  createdAt,
  updatedAt,
});

export const ReviewTable = t.pgTable(
  'reviews',
  {
    id,
    userId: t
      .uuid('user_id')
      .references(() => UserTable.id, { onDelete: 'no action' })
      .notNull(),
    productId: t
      .uuid('product_id')
      .references(() => ProductTable.id)
      .notNull(),
    rating: t.integer('rating'),
    title: t.varchar('title', { length: 255 }),
    body: t.text('body'),
    foundHelpful: t.integer().notNull().default(0),
    reviewedAt: t
      .timestamp('reviewed_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    t.check('rating_check', sql`${table.rating} BETWEEN 1 AND 5`),
    t.index('reviews_product_idx').on(table.productId),
    t.index('reviews_user_idx').on(table.userId),
    t.index('reviews_reivews_date_idx').on(table.reviewedAt),
    t
      .uniqueIndex('reviews_user_product_unique')
      .on(table.userId, table.productId),
  ],
);

export const ReviewFeedbackTable = t.pgTable('review_feedbacks', {
  id,
  reviewId: t
    .uuid('review_id')
    .references(() => ReviewTable.id, { onDelete: 'no action' })
    .notNull(),
  userId: t
    .uuid('user_id')
    .references(() => UserTable.id, { onDelete: 'no action' })
    .notNull(),
  body: t.text('body'),
  createdAt,
  updatedAt,
});

export const NewsletterSubscriptionTable = t.pgTable(
  'newsletter_subscriptions',
  {
    id,
    email: t.varchar('email', { length: 255 }).notNull().unique(),
    createdAt,
    updatedAt,
  },
);

export const ContactTable = t.pgTable('contacts', {
  id,
  name: t.varchar('name', { length: 255 }).notNull(),
  email: t.varchar('email', { length: 255 }).notNull().unique(),
  phone: t.varchar('phone', { length: 255 }).notNull(),
  subject: t.text('subject'),
  message: t.text('message'),
  createdAt,
  updatedAt,
});

// relations
export const UserTableRelations = relations(UserTable, ({ many }) => ({
  shippingAddress: many(ShippingAddressTable),
  orders: many(OrderTable),
  reviews: many(ReviewTable),
  reviewFeedbacks: many(ReviewFeedbackTable),
}));

export const ShippingAddressTableRelations = relations(
  ShippingAddressTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [ShippingAddressTable.userId],
      references: [UserTable.id],
    }),
    orders: many(OrderTable),
  }),
);

export const ProductTableRelations = relations(
  ProductTable,
  ({ one, many }) => ({
    orderItems: many(OrderItemTable),
    reviews: many(ReviewTable),
    productImages: many(ProductImageTable),
    category: one(CategoryTable, {
      fields: [ProductTable.categoryId],
      references: [CategoryTable.id],
    }),
  }),
);

export const OrderTableRelations = relations(OrderTable, ({ one, many }) => ({
  orderItems: many(OrderItemTable),
  user: one(UserTable, {
    fields: [OrderTable.userId],
    references: [UserTable.id],
  }),
  shippingAddress: one(ShippingAddressTable, {
    fields: [OrderTable.shippingAddressId],
    references: [ShippingAddressTable.id],
  }),
}));

export const CategoryTableRelations = relations(CategoryTable, ({ many }) => ({
  products: many(ProductTable),
}));

export const ReviewTableRelations = relations(ReviewTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [ReviewTable.userId],
    references: [UserTable.id],
  }),
  reviewFeedbacks: many(ReviewFeedbackTable),
}));

export const ReviewFeedbackTableRelations = relations(
  ReviewFeedbackTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [ReviewFeedbackTable.userId],
      references: [UserTable.id],
    }),
    review: one(ReviewTable, {
      fields: [ReviewFeedbackTable.reviewId],
      references: [ReviewTable.id],
    }),
  }),
);

export const ProductImageTableRelations = relations(
  ProductImageTable,
  ({ one }) => ({
    product: one(ProductTable, {
      fields: [ProductImageTable.productId],
      references: [ProductTable.id],
    }),
  }),
);
