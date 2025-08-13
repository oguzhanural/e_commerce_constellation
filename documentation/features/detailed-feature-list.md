# Detailed Feature List - e_commerce_constellation

**Project:** e_commerce_constellation  
**Date:** 2025-01-11  
**Version:** 1.0

This document enumerates **MVP** and **Post MVP** features with descriptions, user stories, acceptance criteria, Apollo Federation contracts, data model impact, priority, and effort.

**Legend:**  
- Priority: P1=MVP, P2=Next, P3=Later  
- Effort: S/M/L/XL  
- Ownership: **Owner** (entity owner subgraph), **Contrib** (contributing subgraph)

---

## 1) Identity (Owner: Identity - PostgreSQL, no ORM)

### 1.1 User Registration [P1][S]
- **Description:** Create user account with email + password, store bcrypt password hash.
- **User Story:** As a new user, I want to sign up with my email and password so that I can track my orders and have a personalized experience.
- **Acceptance:** Valid email/password returns 201 with JWT token; duplicate email returns 409; password validation enforced (8+ chars, mixed case, numbers).
- **Federation:** `type User @key(fields: "id") { id: ID!, email: String!, firstName: String, lastName: String }`
- **API:** `mutation register(email: String!, password: String!, firstName: String, lastName: String): AuthPayload!`
- **Data:** `users(id UUID PK, email VARCHAR UNIQUE, password_hash VARCHAR, first_name VARCHAR, last_name VARCHAR, created_at TIMESTAMP)`

### 1.2 User Login & JWT [P1][S]
- **Description:** Authenticate user credentials and issue JWT token.
- **User Story:** As a registered user, I want to log in with my credentials so that I can access my account and orders.
- **Acceptance:** Valid credentials return JWT token; invalid credentials return 401; token expires in 7 days.
- **API:** `mutation login(email: String!, password: String!): AuthPayload!`
- **Router:** Validate JWT in Router; propagate `userId` via context to all subgraphs.

### 1.3 Current User Profile [P1][S]
- **Description:** Return authenticated user's profile information.
- **User Story:** As a logged-in user, I want to view my profile information so that I can verify my account details.
- **Acceptance:** Returns user data for valid JWT; returns null for unauthenticated requests.
- **API:** `query me: User`

### 1.4 User Logout [P1][S]
- **Description:** Invalidate user session and clear authentication.
- **User Story:** As a logged-in user, I want to securely log out so that my account remains protected.
- **Acceptance:** Clears client-side JWT; returns success response.
- **API:** `mutation logout: Boolean!`

### 1.5 Password Reset [P2][M]
- **Description:** Email-based password reset with secure tokens.
- **User Story:** As a user, I want to reset my password if I forget it so that I can regain access to my account.

### 1.6 Email Verification [P3][M]
- **Description:** Verify email ownership before enabling certain account actions.

**Federation Contract (Owner):**
```graphql
type User @key(fields: "id") {
  id: ID!
  email: String!
  firstName: String
  lastName: String
  createdAt: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  me: User
}

type Mutation {
  register(email: String!, password: String!, firstName: String, lastName: String): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  logout: Boolean!
}
```

---

## 2) Catalog (Owner: Catalog - MongoDB)

### 2.1 Product Listing [P1][S]
- **Description:** List products with pagination, basic fields (id, slug, title, description, categoryId).
- **User Story:** As a guest user, I want to see a list of available products so that I can browse the catalog.
- **Acceptance:** Returns paginated product list; supports empty state; default 20 items per page.
- **API:** `query products(search: String, categoryId: ID, first: Int, after: String): ProductConnection!`
- **Data:** MongoDB `products { _id, slug, title, description, categoryId, images, attributes, createdAt }`

### 2.2 Product Detail [P1][S]
- **Description:** Get single product by ID or slug with full details.
- **User Story:** As a user, I want to view detailed product information so that I can make informed purchase decisions.
- **Acceptance:** Returns product for valid ID/slug; returns null for non-existent products.
- **API:** `query product(id: ID!): Product`, `query productBySlug(slug: String!): Product`

### 2.3 Category Filtering [P1][S]
- **Description:** Filter products by category ID.
- **User Story:** As a user, I want to filter products by category so that I can narrow down my choices.
- **Acceptance:** Returns products matching categoryId; empty array if no matches.
- **API:** `query products(categoryId: ID): ProductConnection!`

### 2.4 Basic Product Search [P1][M]
- **Description:** Simple text search on product title and description.
- **User Story:** As a user, I want to search products by name so that I can quickly find specific items.
- **Acceptance:** Returns products matching search term; case-insensitive; supports partial matches.
- **API:** `query products(search: String): ProductConnection!`
- **Implementation:** MongoDB text index on title/description fields.

### 2.5 Category Management [P1][S]
- **Description:** Basic category listing for navigation.
- **User Story:** As a user, I want to see product categories so that I can browse by type.
- **API:** `query categories: [Category!]!`
- **Data:** MongoDB `categories { _id, name, slug, description, active }`

### 2.6 Product Variants [P2][L]
- **Description:** Support for product variants (size, color, etc.).
- **User Story:** As a user, I want to select product variants so that I can choose the exact item I want.

### 2.7 Product Images & Media [P2][M]
- **Description:** Image gallery, thumbnails, and media assets.
- **User Story:** As a user, I want to see product images so that I can better evaluate products.

**Federation Contract (Owner):**
```graphql
type Product @key(fields: "id") {
  id: ID!
  slug: String!
  title: String!
  description: String
  categoryId: ID
  images: [String!]!
  attributes: ProductAttributes
  createdAt: String!
}

type ProductAttributes {
  brand: String
  weight: Float
  dimensions: Dimensions
}

type Category {
  id: ID!
  name: String!
  slug: String!
  description: String
}

type Query {
  products(search: String, categoryId: ID, first: Int = 20, after: String): ProductConnection!
  product(id: ID!): Product
  productBySlug(slug: String!): Product
  categories: [Category!]!
}
```

---

## 3) Pricing (Contrib to Product - PostgreSQL)

### 3.1 Current Price [P1][S]
- **Description:** Contribute `currentPrice: Money!` field to Product entity.
- **User Story:** As a user, I want to see product prices so that I know how much items cost.
- **Acceptance:** Returns formatted price in TRY; defaults to 0 if no price found (MVP fallback).
- **API:** Extends Product with `currentPrice: Money!`
- **Data:** `product_prices(product_id TEXT PK, amount INT, currency TEXT DEFAULT 'TRY', updated_at TIMESTAMP)`

### 3.2 Price History & Auditing [P2][S]
- **Description:** Track price changes for auditing and analytics.
- **Data:** `price_history(id UUID, product_id TEXT, old_amount INT, new_amount INT, changed_at TIMESTAMP)`

### 3.3 Multi-Currency Support [P2][M]
- **Description:** Support multiple currencies with conversion rates.
- **User Story:** As an international user, I want to see prices in my preferred currency.

### 3.4 Promotions & Discounts [P3][L]
- **Description:** Campaign engine with discount rules and coupon codes.
- **User Story:** As a user, I want to apply discount codes to get reduced prices.

**Federation Contract (Contributor):**
```graphql
extend type Product @key(fields: "id") {
  id: ID! @external
  currentPrice: Money!
}

type Money {
  amount: Int! # Amount in cents
  currency: String!
  formatted: String! # "₺15.99"
}
```

---

## 4) Inventory (Contrib to Product - PostgreSQL)

### 4.1 Stock Availability [P1][S]
- **Description:** Contribute `inStock: Boolean!` based on stock levels.
- **User Story:** As a user, I want to see if products are in stock so that I know if I can purchase them.
- **Acceptance:** `inStock = stock_level > 0`; real-time availability.
- **API:** Extends Product with `inStock: Boolean!`
- **Data:** `inventory(product_id TEXT PK, stock_level INT, reserved_stock INT, updated_at TIMESTAMP)`

### 4.2 Stock Level Display [P2][S]
- **Description:** Show numeric stock levels for transparency.
- **User Story:** As a user, I want to see how many items are left so that I can make purchase decisions.
- **API:** Extends Product with `stockLevel: Int`

### 4.3 Stock Movements & Auditing [P2][M]
- **Description:** Track all stock changes for inventory management.
- **Data:** `stock_movements(id UUID, product_id TEXT, movement_type VARCHAR, quantity INT, reference_id TEXT, created_at TIMESTAMP)`

### 4.4 Stock Reservation [P3][L]
- **Description:** Reserve stock during checkout process to prevent overselling.
- **User Story:** As a user, I want my cart items reserved during checkout so they don't become unavailable.

**Federation Contract (Contributor):**
```graphql
extend type Product @key(fields: "id") {
  id: ID! @external
  inStock: Boolean!
  stockLevel: Int
}
```

---

## 5) Cart (Owner: Cart - MongoDB/Redis)

### 5.1 Cart Creation & Retrieval [P1][S]
- **Description:** Create new cart or retrieve existing cart by ID.
- **User Story:** As a user, I want to maintain a shopping cart so that I can collect items before purchasing.
- **Acceptance:** Creates cart with unique ID; retrieves existing cart with items.
- **API:** `query cart(id: ID!): Cart`, `mutation createCart: Cart!`
- **Data:** MongoDB `carts { _id, userId, sessionId, items[], createdAt, updatedAt, expiresAt }`

### 5.2 Add Items to Cart [P1][M]
- **Description:** Add products to cart with specified quantities.
- **User Story:** As a user, I want to add products to my cart so that I can purchase multiple items together.
- **Acceptance:** Adding existing item increments quantity; validates product exists and is in stock.
- **API:** `mutation addToCart(cartId: ID!, productId: ID!, quantity: Int!): Cart!`

### 5.3 Update Cart Items [P1][M]
- **Description:** Modify quantities of items in cart.
- **User Story:** As a user, I want to update item quantities so that I can buy the right amounts.
- **Acceptance:** Updates quantity; removes item if quantity <= 0; validates stock availability.
- **API:** `mutation updateCartItem(cartId: ID!, productId: ID!, quantity: Int!): Cart!`

### 5.4 Remove Cart Items [P1][S]
- **Description:** Remove specific items from cart.
- **User Story:** As a user, I want to remove items from my cart so that I can change my mind about purchases.
- **API:** `mutation removeCartItem(cartId: ID!, productId: ID!): Cart!`

### 5.5 Cart Totals Calculation [P1][M]
- **Description:** Calculate total amount including taxes (computed on read for MVP).
- **User Story:** As a user, I want to see my cart total so that I know how much I'll spend.
- **Acceptance:** Totals reflect current prices; includes tax calculation; updates when prices change.
- **Implementation:** Calculated dynamically by querying pricing service.

### 5.6 Guest Cart Support [P2][M]
- **Description:** Support carts for non-authenticated users using session IDs.
- **User Story:** As a guest user, I want to add items to cart without creating an account.

### 5.7 Cart Persistence & Expiry [P2][S]
- **Description:** Persist cart across sessions; auto-expire old carts.
- **Implementation:** TTL index on MongoDB for automatic cleanup.

**Federation Contract (Owner):**
```graphql
type Cart @key(fields: "id") {
  id: ID!
  userId: ID
  items: [CartItem!]!
  totalAmount: Money!
  itemCount: Int!
  createdAt: String!
  updatedAt: String!
}

type CartItem {
  productId: ID!
  quantity: Int!
  addedAt: String!
}

type Query {
  cart(id: ID!): Cart
  cartByUser(userId: ID!): Cart
}

type Mutation {
  createCart(userId: ID): Cart!
  addToCart(cartId: ID!, productId: ID!, quantity: Int!): Cart!
  updateCartItem(cartId: ID!, productId: ID!, quantity: Int!): Cart!
  removeCartItem(cartId: ID!, productId: ID!): Cart!
  clearCart(cartId: ID!): Cart!
}
```

---

## 6) Order (Owner: Order - PostgreSQL)

### 6.1 Order Creation from Cart [P1][M]
- **Description:** Convert cart to order with address and item snapshots.
- **User Story:** As a user, I want to create an order from my cart so that I can complete my purchase.
- **Acceptance:** Validates cart exists and has items; snapshots current prices; creates order in PENDING status.
- **API:** `mutation createOrder(cartId: ID!, shippingAddress: AddressInput!): Order!`
- **Data:** `orders(id UUID PK, user_id UUID, status VARCHAR, total_amount INT, currency VARCHAR, shipping_address JSONB, created_at TIMESTAMP)`

### 6.2 Order Status Lifecycle [P1][S]
- **Description:** Manage order status transitions: PENDING → CONFIRMED → SHIPPED → DELIVERED → CANCELLED.
- **User Story:** As a user, I want to track my order status so that I know when to expect delivery.
- **Acceptance:** Status updates trigger notifications; only valid transitions allowed.
- **API:** `mutation updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!`

### 6.3 Order Items Management [P1][S]
- **Description:** Store order items with price snapshots at time of order.
- **User Story:** As a user, I want to see exactly what I ordered and at what price.
- **Data:** `order_items(id UUID PK, order_id UUID FK, product_id TEXT, quantity INT, unit_price INT, created_at TIMESTAMP)`

### 6.4 Order History for Users [P1][S]
- **Description:** List all orders for authenticated user.
- **User Story:** As a registered user, I want to view my order history so that I can track previous purchases.
- **Acceptance:** Returns paginated list ordered by creation date; shows order summary.
- **API:** `query ordersByUser(userId: ID!, first: Int, after: String): OrderConnection!`

### 6.5 Order Detail View [P1][S]
- **Description:** Get detailed information about a specific order.
- **User Story:** As a user, I want to view order details so that I can see items, status, and tracking information.
- **API:** `query order(id: ID!): Order`

### 6.6 Order Cancellation [P2][M]
- **Description:** Allow users to cancel orders within time limits.
- **User Story:** As a user, I want to cancel my order if I change my mind.

### 6.7 Order Returns & Refunds [P3][L]
- **Description:** Handle return requests and refund processing.

**Federation Contract (Owner):**
```graphql
type Order @key(fields: "id") {
  id: ID!
  userId: ID!
  status: OrderStatus!
  items: [OrderItem!]!
  totalAmount: Money!
  shippingAddress: Address!
  createdAt: String!
  updatedAt: String!
}

type OrderItem {
  id: ID!
  productId: ID!
  quantity: Int!
  unitPrice: Money!
  totalPrice: Money!
}

type Address {
  street: String!
  city: String!
  state: String
  postalCode: String!
  country: String!
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

type Query {
  order(id: ID!): Order
  ordersByUser(userId: ID!, first: Int = 10, after: String): OrderConnection!
}

type Mutation {
  createOrder(cartId: ID!, shippingAddress: AddressInput!): Order!
  updateOrderStatus(orderId: ID!, status: OrderStatus!): Order!
}
```

---

## 7) Payment (Contrib to Order - PostgreSQL)

### 7.1 Mock Payment Processing [P1][M]
- **Description:** Contribute `paymentStatus` to Order; mock PSP for MVP.
- **User Story:** As a user, I want to pay for my order so that it can be processed and shipped.
- **Acceptance:** Creates payment record; simulates success/failure; updates order payment status.
- **API:** `mutation processPayment(orderId: ID!, paymentMethod: PaymentMethodInput!): PaymentResult!`
- **Data:** `payments(id UUID PK, order_id UUID UNIQUE, status VARCHAR, provider VARCHAR, amount INT, currency VARCHAR, created_at TIMESTAMP)`

### 7.2 Payment Status Tracking [P1][S]
- **Description:** Track payment status and contribute to Order entity.
- **Acceptance:** Payment status reflects in order queries; supports PENDING, PAID, FAILED, REFUNDED.

### 7.3 Payment Method Storage [P2][M]
- **Description:** Store payment method details (tokenized for security).
- **User Story:** As a registered user, I want to save payment methods for faster checkout.

### 7.4 Real PSP Integration [P2][L]
- **Description:** Integrate with real payment providers (Stripe, Iyzico, etc.).
- **User Story:** As a user, I want to pay with real payment methods (credit card, bank transfer).

### 7.5 Payment Webhooks [P2][M]
- **Description:** Handle payment provider webhooks for status updates.

### 7.6 Refund Processing [P3][M]
- **Description:** Process refunds for cancelled or returned orders.

**Federation Contract (Contributor):**
```graphql
extend type Order @key(fields: "id") {
  id: ID! @external
  paymentStatus: PaymentStatus!
  paymentMethod: PaymentMethod
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

type PaymentMethod {
  type: PaymentMethodType!
  lastFourDigits: String
  expiryMonth: Int
  expiryYear: Int
}

enum PaymentMethodType {
  CREDIT_CARD
  BANK_TRANSFER
  DIGITAL_WALLET
}

type PaymentResult {
  success: Boolean!
  transactionId: String
  error: String
}

type Mutation {
  processPayment(orderId: ID!, paymentMethod: PaymentMethodInput!): PaymentResult!
}
```

---

## 8) Shipping (Contrib to Order - PostgreSQL)

### 8.1 Shipping Fee Calculation [P1][M]
- **Description:** Contribute `shippingFee` to Order based on simple rules.
- **User Story:** As a user, I want to know shipping costs so that I can understand the total price.
- **Acceptance:** Calculates fee based on order total; supports free shipping thresholds; flat rate for MVP.
- **Data:** `shipping_methods(id UUID PK, name VARCHAR, base_cost INT, free_threshold INT, active BOOLEAN)`

### 8.2 Shipping Method Selection [P1][S]
- **Description:** Allow users to choose from available shipping methods.
- **User Story:** As a user, I want to choose shipping speed so that I can balance cost and delivery time.
- **API:** `query shippingMethods: [ShippingMethod!]!`

### 8.3 Shipping Address Validation [P2][M]
- **Description:** Validate shipping addresses and suggest corrections.
- **User Story:** As a user, I want address validation so that my order is delivered correctly.

### 8.4 Tracking Integration [P3][L]
- **Description:** Integrate with shipping carriers for real-time tracking.
- **User Story:** As a user, I want to track my shipment so that I know when it will arrive.

### 8.5 Delivery Estimation [P2][M]
- **Description:** Provide estimated delivery dates based on shipping method and location.

**Federation Contract (Contributor):**
```graphql
extend type Order @key(fields: "id") {
  id: ID! @external
  shippingFee: Money!
  shippingMethod: ShippingMethod!
  estimatedDelivery: String
}

type ShippingMethod {
  id: ID!
  name: String!
  description: String
  baseCost: Money!
  estimatedDays: Int!
}

type Query {
  shippingMethods: [ShippingMethod!]!
  calculateShipping(items: [CartItemInput!]!, address: AddressInput!): Money!
}
```

---

## 9) Frontend (Next.js 15 + Apollo Client)

### 9.1 Product Listing Pages [P1][M]
- **Description:** Server-side rendered product listing with pagination and filters.
- **User Story:** As a user, I want to browse products efficiently with fast loading times.
- **Acceptance:** SSR for SEO; client-side pagination; category filters; search functionality.
- **Implementation:** Next.js App Router with RSC; Apollo Client for data fetching.

### 9.2 Product Detail Pages [P1][M]
- **Description:** Individual product pages with full details and purchase options.
- **User Story:** As a user, I want detailed product information so I can make informed decisions.
- **Acceptance:** SSR/ISR for performance; add to cart functionality; stock status; price display.
- **Routes:** `/products/[slug]`

### 9.3 Shopping Cart Page [P1][M]
- **Description:** Interactive cart management with real-time updates.
- **User Story:** As a user, I want to review and modify my cart before checkout.
- **Acceptance:** Update quantities; remove items; see totals; proceed to checkout.
- **Routes:** `/cart`

### 9.4 Checkout Flow [P1][L]
- **Description:** Multi-step checkout process: Cart → Address → Payment → Confirmation.
- **User Story:** As a user, I want a smooth checkout process so I can complete my purchase quickly.
- **Acceptance:** Form validation; order review; payment processing; confirmation page.
- **Routes:** `/checkout/address`, `/checkout/payment`, `/checkout/confirmation`

### 9.5 User Authentication Pages [P1][M]
- **Description:** Login, registration, and account management pages.
- **User Story:** As a user, I want to manage my account and access my order history.
- **Acceptance:** JWT storage (HTTP-only cookies); protected routes; profile management.
- **Routes:** `/auth/login`, `/auth/register`, `/account/profile`

### 9.6 Order History & Details [P1][M]
- **Description:** User dashboard with order history and detailed order views.
- **User Story:** As a registered user, I want to track my orders and view past purchases.
- **Routes:** `/account/orders`, `/account/orders/[id]`

### 9.7 Error Handling & Loading States [P1][S]
- **Description:** Comprehensive error boundaries and loading states.
- **Acceptance:** 404 pages; error fallbacks; skeleton loading; empty states.

### 9.8 Responsive Design & Accessibility [P2][M]
- **Description:** Mobile-first responsive design with accessibility compliance.
- **User Story:** As a user on any device, I want the site to work well and be accessible.

### 9.9 Performance Optimization [P2][L]
- **Description:** Image optimization, code splitting, and caching strategies.
- **Implementation:** Next.js Image component; dynamic imports; Apollo Client caching.

---

## 10) Cross-Cutting Concerns

### 10.1 Authentication & Authorization [P1][S]
- **Description:** JWT validation at Apollo Router; context propagation.
- **Implementation:** Router validates JWT; injects userId into context for all subgraphs.

### 10.2 Input Validation [P1][S]
- **Description:** Comprehensive input validation using Zod schemas.
- **Acceptance:** All mutations validate inputs; return typed error messages.

### 10.3 Error Handling & Logging [P1][S]
- **Description:** Standardized error handling with structured logging.
- **Implementation:** Pino for JSON logging; error formatters; no sensitive data in logs.

### 10.4 DataLoader for N+1 Prevention [P1][S]
- **Description:** Implement DataLoader pattern in all contributing subgraphs.
- **Acceptance:** Batched queries for pricing, inventory, payment status.

### 10.5 Rate Limiting & Security [P2][M]
- **Description:** Protect APIs from abuse with rate limiting and security headers.

### 10.6 Observability [P2][M]
- **Description:** Distributed tracing, metrics, and monitoring.
- **Implementation:** OpenTelemetry for tracing; Prometheus metrics; health checks.

### 10.7 Caching Strategy [P2][M]
- **Description:** Multi-layer caching with Redis and Apollo Client.
- **Implementation:** Router-level caching; subgraph caching; client-side caching.

---

## 11) DevOps & Infrastructure

### 11.1 CI Pipeline [P1][M]
- **Description:** Automated linting, testing, and supergraph composition.
- **Acceptance:** GitHub Actions workflow; fails on lint errors; runs all tests; composes supergraph.
- **Pipeline:** Lint → Test → Build → Compose → Deploy

### 11.2 GraphQL Code Generation [P1][S]
- **Description:** Generate TypeScript types from GraphQL schemas.
- **Implementation:** GraphQL Codegen for both server and client types.

### 11.3 Database Migrations [P1][M]
- **Description:** Automated database schema management.
- **Implementation:** SQL migration files with version control.

### 11.4 Local Development Environment [P1][S]
- **Description:** Docker Compose setup for local development.
- **Acceptance:** Single command starts all services; hot reload for development.

### 11.5 Production Deployment [P2][L]
- **Description:** Container-based deployment with service orchestration.
- **Implementation:** Docker images; Kubernetes or Docker Compose for production.

### 11.6 Monitoring & Alerting [P2][M]
- **Description:** Production monitoring with alerting on critical issues.

---

## 12) Dependencies & Build Sequence

### Phase 1: Foundation
1. **Identity Service** - Required for authentication across all services
2. **Catalog Service** - Base entity for product information
3. **Apollo Router Setup** - Gateway configuration and schema composition

### Phase 2: Core Commerce
4. **Pricing Service** - Contributes to Product entity
5. **Inventory Service** - Contributes to Product entity  
6. **Cart Service** - Depends on Catalog and Pricing
7. **Frontend Foundation** - Product listing and detail pages

### Phase 3: Checkout Flow
8. **Order Service** - Depends on Cart, Identity, and pricing validation
9. **Payment Service** - Contributes to Order entity
10. **Shipping Service** - Contributes to Order entity
11. **Frontend Checkout** - Complete user flow implementation

### Phase 4: Enhancement
12. **Advanced Features** - Search, filtering, recommendations
13. **Observability** - Monitoring, tracing, metrics
14. **Performance** - Caching, optimization, scaling

---

## 13) MVP Success Criteria

### Technical Acceptance
- [ ] Apollo Router successfully serves federated schema
- [ ] Query `{ products { id title currentPrice { amount currency } inStock } }` returns data
- [ ] Cart operations work with accurate total calculations
- [ ] Order creation succeeds with proper status transitions
- [ ] Mock payment processing updates order payment status
- [ ] CI pipeline passes all checks and composition validation
- [ ] All services run locally with single `pnpm dev` command

### Business Acceptance  
- [ ] User can browse products and view details
- [ ] User can add items to cart and manage quantities
- [ ] User can register, login, and access account
- [ ] User can complete checkout process end-to-end
- [ ] User can view order confirmation and history
- [ ] System handles error states gracefully
- [ ] Performance targets met (P95 < 300ms for simple queries)

---

## 14) Post-MVP Roadmap

### Short Term (P2 Features)
- Advanced search with Elasticsearch
- User profile management and saved addresses
- Multiple payment methods and real PSP integration
- Enhanced error handling and retry logic
- Performance monitoring and optimization

### Medium Term (P3 Features)
- Product reviews and ratings system
- Wishlist and favorites functionality
- Coupon and discount engine
- Advanced inventory management with reservations
- Shipping carrier integration and tracking

### Long Term (Future)
- Admin dashboard for catalog and order management
- Advanced analytics and reporting
- Multi-currency and internationalization
- Mobile applications (React Native)
- Machine learning recommendations
- Event-driven architecture with message queues

---

## 15) Technical Notes

### Federation Best Practices
- **Clear Ownership**: Each entity has one owner, others contribute fields
- **Proper Keys**: Use `@key(fields: "id")` for all entities
- **External Fields**: Mark contributed fields as `@external` in contributing services
- **Reference Resolvers**: Implement `__resolveReference` for federated entities

### Database Strategy
- **No ORM**: Use raw SQL with `pg` for PostgreSQL to strengthen SQL skills
- **Migration Management**: Version-controlled SQL files with proper rollback support
- **Connection Pooling**: Optimize database connections across services

### Security Guidelines
- **JWT at Router**: Centralized authentication with context propagation
- **Input Validation**: Zod schemas for all mutations and sensitive queries
- **Secret Management**: Environment variables for all secrets; never commit
- **Error Messages**: Generic client errors; detailed server-side logging

### Performance Targets
- Product listing: P95 ≤ 200ms
- Product detail: P95 ≤ 150ms  
- Add to cart: P95 ≤ 100ms
- Order creation: P95 ≤ 500ms
- Cart operations: P95 ≤ 150ms

---

This detailed feature list serves as the implementation roadmap for the e_commerce_constellation project, ensuring all stakeholders understand the scope, dependencies, and acceptance criteria for each feature.
