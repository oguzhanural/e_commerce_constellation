# Product Requirements Document (PRD)

## Project: e_commerce_constellation
### Version: 2.0
### Date: 2025-01-11
### Status: Draft

---

## 1. Executive Summary

e_commerce_constellation is a microservices-based e-commerce platform designed to practice and demonstrate Apollo Federation v2 with Node.js (TypeScript) subgraphs and an Apollo Router gateway. The system uses a monorepo via Nx, Next.js for the web client, PostgreSQL 17 (without ORM) where relational modeling is preferred, MongoDB where a document model is beneficial (e.g., Catalog), and Redis for caching. CI/CD is implemented with GitHub Actions.

**Vision**: Create a realistic, production-style learning environment with professional engineering practices while delivering a functional e-commerce experience.

**Mission**: Build a working MVP that demonstrates modern microservices architecture, Apollo Federation v2 patterns, and full-stack TypeScript development.

### Success Metrics
- **Technical**: 100% uptime, P95 latency ≤ 300ms, successful CI/CD pipeline
- **Business**: Complete checkout flow working end-to-end
- **Learning**: All 8 subgraphs implemented with proper federation patterns

### Guiding Principles
- Build a working MVP fast; iterate with feedback
- Favor clarity and explicit contracts (federated schema) over premature abstractions
- No ORM for Postgres: use native SQL via `pg` to strengthen SQL skills
- Use Apollo Federation idioms correctly (entity ownership, references, contributions)
- Keep observability first class (traces, logs, metrics)

---

## 2. Problem Statement

**Current State**: Learning Apollo Federation v2 requires a realistic, complex domain with multiple services that naturally need to share data and maintain clear boundaries.

**Problem**: Most tutorials use oversimplified examples that don't reflect real-world complexity of microservices architecture, federation patterns, and production concerns.

**Solution**: Build a complete e-commerce platform that demonstrates:
- Complex federated entities with multiple contributors
- Real database interactions without ORM abstractions
- Production-ready patterns for observability, testing, and CI/CD

---

## 3. Goals & Non-Goals

### Primary Goals
- **Technical Mastery**: Exercise Apollo Federation v2 concepts (@key, @external, extend type, @requires/@provides)
- **Architecture Practice**: Implement domain boundaries with clear ownership/contribution patterns
- **Database Skills**: Strengthen PostgreSQL skills with raw SQL (DDL/DML, migrations)
- **DevOps Excellence**: Establish professional baseline with Nx monorepo, CI schema composition checks, observability

### Business Goals  
- **MVP Delivery**: Functional checkout flow (browse → cart → checkout → payment → order)
- **User Experience**: Responsive Next.js web application with server-side rendering
- **Data Integrity**: Reliable inventory management and order processing

### Non-Goals (Out of Scope for MVP)
- ❌ Advanced search (Elasticsearch), complex promotions/loyalty rules
- ❌ Multi PSP integrations, shipment carrier integrations  
- ❌ Reviews/ratings, wishlists, coupons, complex returns workflow
- ❌ Full multi-tenant or multi-region production hardening
- ❌ Real payment processing (mock PSP only)
- ❌ Mobile applications (web-first)

---

## 4. Target Users & Personas

### Primary Persona: Guest Buyer
**Demographics**: Any person wanting to purchase products online
**Goals**: Find products quickly, easy checkout process, order tracking
**Pain Points**: Complex registration flows, slow loading times, confusing checkout
**Technical Context**: Uses modern browsers, expects mobile-responsive design

### Secondary Persona: Registered Buyer  
**Demographics**: Returning customers who create accounts
**Goals**: Faster checkout, order history, account management
**Pain Points**: Forgotten passwords, lost order information
**Technical Context**: Values personalization and saved payment methods

### Future Persona: Admin User
**Demographics**: Business operators managing the platform
**Goals**: Manage inventory, track sales, customer support
**Pain Points**: Complex admin interfaces, lack of real-time data
**Technical Context**: Needs dashboards and reporting tools

### Technical Persona: Developer
**Demographics**: Full-stack developers learning federation
**Goals**: Understand microservices patterns, practice modern development
**Pain Points**: Poor documentation, unrealistic examples
**Technical Context**: Familiar with TypeScript, GraphQL, modern tooling

---

## 5. User Stories

### Epic 1: Product Discovery
**As a** guest user  
**I want to** browse and search for products  
**So that** I can find items I want to purchase  

#### User Stories:
- **PD-001**: As a guest user, I want to see a list of available products so that I can browse the catalog
- **PD-002**: As a guest user, I want to view detailed product information so that I can make informed purchase decisions  
- **PD-003**: As a guest user, I want to see product prices and availability so that I know if I can afford and obtain the item
- **PD-004**: As a guest user, I want to search products by name so that I can quickly find specific items
- **PD-005**: As a guest user, I want to filter products by category so that I can narrow down my choices

### Epic 2: Shopping Cart Management
**As a** user (guest or registered)  
**I want to** manage items in my shopping cart  
**So that** I can collect items before purchasing  

#### User Stories:
- **SC-001**: As a user, I want to add products to my cart so that I can purchase multiple items together
- **SC-002**: As a user, I want to view my cart contents so that I can review my selections
- **SC-003**: As a user, I want to update item quantities in my cart so that I can buy the right amounts
- **SC-004**: As a user, I want to remove items from my cart so that I can change my mind about purchases
- **SC-005**: As a user, I want to see my cart total so that I know how much I'll spend

### Epic 3: User Account Management  
**As a** potential customer  
**I want to** create and manage my account  
**So that** I can have a personalized experience and track my orders

#### User Stories:
- **UA-001**: As a guest, I want to register for an account so that I can save my information for future purchases
- **UA-002**: As a registered user, I want to log in to my account so that I can access my personal information
- **UA-003**: As a registered user, I want to view my profile so that I can see my account details
- **UA-004**: As a registered user, I want to log out securely so that my account remains protected

### Epic 4: Checkout & Payment
**As a** user with items in my cart  
**I want to** complete my purchase  
**So that** I can receive the products I want

#### User Stories:
- **CP-001**: As a user, I want to provide my shipping address so that my order can be delivered
- **CP-002**: As a user, I want to review my order summary so that I can confirm my purchase details  
- **CP-003**: As a user, I want to select a payment method so that I can pay for my order
- **CP-004**: As a user, I want to complete payment so that my order is confirmed
- **CP-005**: As a user, I want to receive order confirmation so that I know my purchase was successful

### Epic 5: Order Management
**As a** registered user  
**I want to** track and manage my orders  
**So that** I can monitor my purchases and delivery status

#### User Stories:
- **OM-001**: As a registered user, I want to view my order history so that I can see previous purchases
- **OM-002**: As a registered user, I want to view order details so that I can track specific orders
- **OM-003**: As a registered user, I want to see order status updates so that I know when to expect delivery

### Epic 6: System Administration (Future)
**As an** admin user  
**I want to** manage the platform  
**So that** I can maintain product information and process orders

#### User Stories (Future Release):
- **SA-001**: As an admin, I want to add new products so that customers have more options
- **SA-002**: As an admin, I want to update inventory levels so that stock information is accurate
- **SA-003**: As an admin, I want to view order reports so that I can track business performance

---

## 6. Core Features & Prioritization

### P0 - Must Have (MVP Release)

#### Feature 1: Product Catalog
**Description**: Display products with basic information, pricing, and inventory status
**Owner**: Catalog subgraph (MongoDB)
**Contributors**: Pricing subgraph (PostgreSQL), Inventory subgraph (PostgreSQL)
**Acceptance Criteria**:
- Products display with title, description, image placeholder
- Prices show in Turkish Lira with proper formatting  
- Stock status shows as "In Stock" / "Out of Stock"
- Product detail pages accessible via slug URLs
- Basic search by product title works
- Category filtering works

#### Feature 2: Shopping Cart  
**Description**: Temporary storage for items before checkout
**Owner**: Cart subgraph (MongoDB/Redis)
**Dependencies**: Product Catalog
**Acceptance Criteria**:
- Anonymous users can add items to cart
- Cart persists across browser sessions (localStorage)
- Quantity updates work correctly
- Cart totals calculate accurately including tax
- Items can be removed individually
- Cart empties after successful order

#### Feature 3: User Authentication
**Description**: Account creation and login system
**Owner**: Identity subgraph (PostgreSQL)  
**Acceptance Criteria**:
- Users can register with email/password
- Email validation prevents duplicates
- Password requirements enforced (8+ chars, mixed case, numbers)
- JWT tokens issued on successful login
- Secure logout clears authentication
- Protected routes redirect to login

#### Feature 4: Checkout Process
**Description**: Convert cart to confirmed order with payment
**Owner**: Order subgraph (PostgreSQL)
**Contributors**: Payment subgraph (PostgreSQL), Shipping subgraph (PostgreSQL)
**Dependencies**: Cart, User Authentication
**Acceptance Criteria**:
- Shipping address form with validation
- Order summary shows items, quantities, prices, total
- Mock payment processing succeeds/fails appropriately  
- Order confirmation page displays order number
- Email confirmation sent (mock)
- Order status updates correctly

### P1 - Should Have (Post-MVP)

#### Feature 5: Order History & Tracking
**Description**: Users can view past orders and current status
**Owner**: Order subgraph
**Acceptance Criteria**:
- Registered users see chronological order list
- Order details page shows items, status, tracking
- Status updates (Pending → Confirmed → Shipped → Delivered)
- Order search by order number

#### Feature 6: Advanced Product Features
**Description**: Enhanced product browsing and discovery
**Owner**: Catalog subgraph
**Acceptance Criteria**:
- Product categories with nested hierarchy
- Advanced search with filters (price range, category)
- Product recommendations
- Product images (actual image handling)

### P2 - Could Have (Future Releases)

- Product reviews and ratings
- Wishlist functionality  
- Coupon/discount system
- Advanced inventory management
- Multi-currency support
- Social login (Google, Apple)

### P3 - Won't Have (This Release)

- Real payment processing
- Shipment tracking integration
- Admin dashboard
- Mobile apps
- Multi-tenant support
- Advanced analytics

---

## 7. User Flows & Journey Maps

### Flow 1: Guest Purchase Journey
```
1. Landing Page
   ↓
2. Browse Products → Search/Filter (optional)
   ↓
3. View Product Detail → Add to Cart
   ↓
4. Shopping Cart → Update quantities (optional)
   ↓
5. Checkout → Enter shipping address
   ↓
6. Payment → Enter payment details (mock)
   ↓
7. Order Confirmation → Order number displayed
   ↓
8. Email Confirmation (mock)
```

### Flow 2: Registered User Purchase Journey  
```
1. Login → Dashboard (optional)
   ↓
2. Browse Products → Search/Filter (optional)
   ↓  
3. View Product Detail → Add to Cart
   ↓
4. Shopping Cart → Review items
   ↓
5. Checkout → Pre-filled shipping address
   ↓
6. Payment → Saved payment method (mock)
   ↓
7. Order Confirmation → Add to order history
   ↓
8. Email Confirmation (mock)
```

### Flow 3: User Registration Journey
```
1. Guest attempts checkout OR clicks "Sign Up"
   ↓
2. Registration Form → Email, password, confirm password
   ↓
3. Form Validation → Email uniqueness check
   ↓
4. Account Created → Auto-login with JWT
   ↓
5. Redirect to previous page or dashboard
```

---

## 8. Technical Architecture Overview

### 8.1 System Architecture (High Level)

- **Client:** Next.js app using Apollo Client, pointing to Apollo Router.
- **Router:** Apollo Router (Rust) serving a composed supergraph (supergraph.graphql).
- **Subgraphs (MVP):**
  - Identity (Postgres) - user, auth.
  - Catalog (MongoDB) - product, variant, category, assets.
  - Pricing (Postgres) - base price (and later campaigns).
  - Inventory (Postgres) - stock, availability.
  - Cart (MongoDB or Redis) - cart, cart items.
  - Order (Postgres) - order, order items, address snapshot.
  - Payment (Postgres) - payment intents/transactions (mock for MVP).
  - Shipping (Postgres) - shipping method, fee rules (basic rules in MVP).

- **Data Ownership & Contribution (examples):**
  - Product owned by Catalog; fields contributed by Pricing (currentPrice) and Inventory (inStock, stockLevel).
  - Order owned by Order; Payment contributes paymentStatus (and possibly paidAt), Shipping contributes shippingFee.

- **Cross cutting:**
  - Auth at Router via JWT validation; context with userId forwarded to subgraphs.
  - DataLoader per subgraph to mitigate N+1.
  - Persisted queries and caching at Router (and short TTL caches in subgraphs).

---

### 8.2 Technology Choices & Rationale

- Node.js + TypeScript - strong typing; rich ecosystem.
- Apollo Federation v2 - domain separation; schema contracts.
- Apollo Router - performance; composition caching; persisted queries.
- Nx Monorepo - shared config, task graph, caching.
- PostgreSQL 17 (no ORM) - direct SQL control.
- MongoDB for Catalog - flexible product/variant docs.
- Redis - caching/ephemeral state (optional for cart).
- GitHub Actions CI with composition check.
- GraphQL Codegen - resolver/client types.

---

## 9. Functional Requirements

### 9.1 Identity
- Register & login (email+password). JWT issued upon login.
- Query current user profile; minimal fields for MVP.
- GraphQL (indicative):
  - `type User @key(fields: "id") { id: ID!, email: String! }`
  - `type Query { me: User }`
  - `type Mutation { register(email: String!, password: String!): AuthPayload, login(...) }`

### 9.2 Catalog (Owner of Product)
- List products; get single product by id/slug.
- Entities: Product(id, slug, title, description, categoryId); variants optional post MVP.
- GraphQL:
  - `type Product @key(fields: "id") { id: ID!, slug: String!, title: String!, description: String, categoryId: ID }`
  - `type Query { products: [Product!]!, product(id: ID!): Product }`

### 9.3 Pricing (Contribution to Product)
- Provide `currentPrice: Money!` for a Product.
- Source: Postgres table `product_price(product_id PK, amount INT cents, currency TEXT)`.
- GraphQL:
  - `extend type Product @key(fields: "id") { id: ID! @external, currentPrice: Money! }`
  - `type Money { amount: Int!, currency: String! }`

### 9.4 Inventory (Contribution to Product)
- Provide availability and stock level.
- Source: Postgres `inventory(product_id PK, stock_level INT)`.
- GraphQL:
  - `extend type Product @key(fields: "id") { id: ID! @external, inStock: Boolean!, stockLevel: Int }`

### 9.5 Cart (Owner of Cart)
- Create/get cart, add/remove/update items, compute totals.
- GraphQL:
  - `type Cart @key(fields: "id") { id: ID!, items: [CartItem!]!, totalAmount: Money! }`
  - `type CartItem { productId: ID!, quantity: Int! }`
  - `type Mutation { addToCart(cartId: ID, productId: ID!, qty: Int!): Cart, updateCartItem(...), removeCartItem(...) }`

### 9.6 Order (Owner of Order)
- Create order from cart; store address snapshot and totals.
- Status lifecycle: PENDING -> CONFIRMED -> FULFILLED -> CANCELLED.
- GraphQL:
  - `type Order @key(fields: "id") { id: ID!, userId: ID!, items: [OrderItem!]!, status: OrderStatus!, totalAmount: Money! }`
  - `type Mutation { createOrder(cartId: ID!, address: AddressInput!): Order }`

### 9.7 Payment (Contribution to Order)
- Mock PSP for MVP; create/confirm payment intent.
- GraphQL:
  - `extend type Order @key(fields: "id") { id: ID! @external, paymentStatus: PaymentStatus! }`
  - `type Mutation { pay(orderId: ID!, method: PaymentMethod!): PaymentResult! }`

### 9.8 Shipping
- Simple fee rules (flat or thresholds). Contribute shippingFee to Order if needed.

---

## 10. Non-Functional Requirements (NFRs)

- **Performance:** P95 latency <= 300ms (simple queries) on local/staging.
- **Availability:** dev/staging best effort; graceful restarts.
- **Security:** JWT at Router; input validation; least privilege DB.
- **Scalability:** Independent subgraph deployability; stateless services.
- **Observability:** OpenTelemetry traces, JSON logs (Pino), Prometheus metrics.
- **Testability:** Unit tests; smoke tests at Router; (later) contract tests.

---

## 11. Data Model (Initial)

### PostgreSQL
- `product_price(product_id TEXT PK, amount INT, currency TEXT DEFAULT 'TRY')`
- `inventory(product_id TEXT PK, stock_level INT)`
- `order(order_id PK, user_id, total_amount, currency, status, created_at ...)`
- `order_item(order_id FK, product_id, unit_amount, quantity, ...)`
- `payment(order_id PK, status, provider_ref, ...)`
- `user(id PK, email UNIQUE, password_hash, ...)`

### MongoDB
- `catalog.products { _id, slug, title, description, categoryId, ... }`
- (optional) categories, assets

---

## 12. API & Federation Contracts

- One owner per entity (@key on owner).
- Others extend + may contribute fields.
- Use @requires when contributed field depends on owner fields; @provides when contributor supplies fields to downstream.
- Implement `__resolveReference` where needed.
- Router: persisted queries, operation registry.

---

## 13. Security & Auth

- JWT verification at Router; userId in context.
- Auth required for sensitive mutations.
- Minimal RBAC for MVP (user role).

---

## 14. CI/CD

- CI: lint, build, unit tests, supergraph composition (artifact).
- CD (later): GHCR images, staging -> prod with approval/canary.
- Protect main with required checks.

---

## 15. Observability

- OpenTelemetry SDK in subgraphs.
- Traces to local collector (or stdout in dev).
- `/metrics` for Prometheus (dev/staging).

---

## 16. Analytics (Later)

- Funnel: browse -> cart -> checkout -> order.
- Server events: add_to_cart, order_created.

---

## 17. Risks & Mitigations

- **N+1 queries:** DataLoader + batched fetch; per request cache.
- **Schema drift:** composition check in CI; codegen types.
- **Over scoping MVP:** strict scope control; core journey first.
- **Stateful cart:** prefer Redis/Mongo; avoid in-memory prod usage.

---

## 18. Milestones & Acceptance Criteria

- **Sprint 0 (Scaffold):** Nx monorepo, Catalog + Pricing, Router compose, Next.js page, Postgres/Mongo setup; CI green.
  - **Acceptance:** `{ products { id title currentPrice { amount } } }` returns data via Router.

- **Sprint 1 (Inventory + Cart):** inStock contribution; cart CRUD; totals.
  - **Acceptance:** cart operations work; totals correct with prices.

- **Sprint 2 (Checkout):** create order from cart; mock payment; order status.
  - **Acceptance:** end-to-end checkout produces persisted order and payment status.

- **Sprint 3 (Hardening):** Observability, caching, N+1 tuning, auth guards.
  - **Acceptance:** traces/logs/metrics visible; latency within targets; auth enforced.

---

## 19. Open Questions

- Compute totals on write vs on read for Cart?
- PaymentMethod ownership/catalog?
- Eventing (Kafka/RabbitMQ) for stock reservation later?

---

## 20. Dependencies & Environment

- macOS (Sequoia 15.5), PostgreSQL 17 (Postgres.app/pgAdmin4), MongoDB (Compass installed).
- Node.js >= 20, pnpm >= 9 (corepack).
- Docker (optional), GitHub Actions, Nx.

---

## 21. Example SDL Fragments

### Catalog (owner)
```graphql
type Product @key(fields: "id") { 
  id: ID!, 
  slug: String!, 
  title: String!, 
  description: String, 
  categoryId: ID 
}
type Query { 
  products: [Product!]!, 
  product(id: ID!): Product 
}
```

### Pricing (contribution)
```graphql
extend type Product @key(fields: "id") { 
  id: ID! @external,
  currentPrice: Money! 
}
type Money { 
  amount: Int!, 
  currency: String! 
}
```

### Inventory (contribution)
```graphql
extend type Product @key(fields: "id") { 
  id: ID! @external, 
  inStock: Boolean!, 
  stockLevel: Int 
}
```

### Cart (owner)
```graphql
type Cart @key(fields: "id") { 
  id: ID!, 
  items: [CartItem!]!, 
  totalAmount: Money! 
}
type CartItem { 
  productId: ID!, 
  quantity: Int! 
}
```

---

## 22. Glossary

- **Owner:** Subgraph that defines @key for an entity.
- **Contribution:** Fields added by a different subgraph to an owned entity.
- **Reference:** Minimal representation (usually { id }) to resolve entity across subgraphs.
- **Supergraph:** Composed schema used by Router.

---
