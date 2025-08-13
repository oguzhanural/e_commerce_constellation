# Technical Design Document (TDD)

## Project: e_commerce_constellation
### Version: 1.0
### Date: 2025-01-11
### Status: Draft

---

## 1. Overview

This Technical Design Document provides detailed implementation guidance for the e_commerce_constellation project, complementing the Product Requirements Document (PRD). It focuses on Apollo Federation v2 patterns, database design, and technical implementation details.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Next.js App   │────│  Apollo Router   │────│     Subgraphs       │
│  (Apollo Client)│    │    (Gateway)     │    │   (8 Services
                                                     (for now))      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │                            │
                              │                    ┌──────────────┐
                              │                    │  PostgreSQL  │
                              │                    │   MongoDB    │
                              │                    │    Redis     │
                              │                    └──────────────┘
                              │
                       ┌─────────────────┐
                       │   Observability │
                       │  (Traces/Logs)  │
                       └─────────────────┘
```

### 2.2 Monorepo Structure

```
apps/
├── web/                    # Next.js 15 App Router
├── router/                 # Apollo Router config
└── subgraphs/
    ├── identity/           # PostgreSQL - Users, Auth
    ├── catalog/            # MongoDB - Products, Categories
    ├── pricing/            # PostgreSQL - Prices
    ├── inventory/          # PostgreSQL - Stock levels
    ├── cart/               # MongoDB/Redis - Shopping carts
    ├── order/              # PostgreSQL - Orders
    ├── payment/            # PostgreSQL - Payment processing
    └── shipping/           # PostgreSQL - Shipping methods

libs/
├── shared-types/           # GraphQL Codegen outputs
├── graphql-fragments/      # Reusable GraphQL fragments
├── utils/                  # Shared utilities
├── database/               # DB connection helpers
└── observability/          # Logging, tracing, metrics
```

---

## 3. Database Design

### 3.1 PostgreSQL Schemas

#### Identity Service
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Pricing Service
```sql
-- Product pricing
CREATE TABLE product_prices (
    product_id VARCHAR(255) PRIMARY KEY,
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'TRY',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history for auditing
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) NOT NULL,
    old_amount INTEGER,
    new_amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Inventory Service
```sql
-- Stock levels
CREATE TABLE inventory (
    product_id VARCHAR(255) PRIMARY KEY,
    stock_level INTEGER NOT NULL DEFAULT 0,
    reserved_stock INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock movements for auditing
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'RESERVED', 'RELEASED'
    quantity INTEGER NOT NULL,
    reference_id VARCHAR(255), -- order_id, adjustment_id, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Order Service
```sql
-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL, -- Snapshot of price at order time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

#### Payment Service
```sql
-- Payment records
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    provider VARCHAR(100) NOT NULL DEFAULT 'MOCK_PSP',
    provider_transaction_id VARCHAR(255),
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
```

#### Shipping Service
```sql
-- Shipping methods
CREATE TABLE shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_cost INTEGER NOT NULL, -- Cost in cents
    currency VARCHAR(3) DEFAULT 'TRY',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default shipping methods
INSERT INTO shipping_methods (name, description, base_cost) VALUES
('Standard Shipping', 'Delivery in 3-5 business days', 1500),
('Express Shipping', 'Delivery in 1-2 business days', 2500),
('Free Shipping', 'Free delivery for orders over 500 TRY', 0);
```

### 3.2 MongoDB Schemas

#### Catalog Service
```javascript
// Products collection
{
  _id: ObjectId,
  slug: String, // URL-friendly identifier
  title: String,
  description: String,
  categoryId: String,
  images: [String], // URLs or placeholders
  attributes: {
    brand: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  createdAt: Date,
  updatedAt: Date
}

// Categories collection (for future hierarchy)
{
  _id: ObjectId,
  name: String,
  slug: String,
  parentId: String, // For nested categories
  description: String,
  active: Boolean,
  createdAt: Date
}
```

#### Cart Service
```javascript
// Carts collection
{
  _id: ObjectId,
  userId: String, // Optional for guest carts
  sessionId: String, // For guest cart persistence
  items: [{
    productId: String,
    quantity: Number,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date // TTL for cleanup
}
```

---

## 4. GraphQL Federation Implementation

### 4.1 Entity Ownership Matrix

| Entity | Owner | Contributors | Key Fields |
|--------|-------|-------------|------------|
| User | Identity | Order (orderCount) | id, email |
| Product | Catalog | Pricing (currentPrice), Inventory (inStock, stockLevel) | id, slug, title |
| Cart | Cart | - | id, items |
| Order | Order | Payment (paymentStatus), Shipping (shippingFee) | id, userId, status |

### 4.2 Schema Definitions

#### Identity Subgraph
```graphql
# identity.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external"])

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

#### Catalog Subgraph
```graphql
# catalog.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

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

type Dimensions {
  length: Float
  width: Float
  height: Float
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

type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
}

type ProductEdge {
  node: Product!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

#### Pricing Subgraph
```graphql
# pricing.graphql
extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external"])

type Product @key(fields: "id") {
  id: ID! @external
  currentPrice: Money!
}

type Money {
  amount: Int! # Amount in cents
  currency: String!
  formatted: String! # "₺15.99"
}

type Query {
  _entities(representations: [_Any!]!): [_Entity]!
}
```

---

## 5. Error Handling Strategy

### 5.1 Error Types

```typescript
// libs/shared-types/src/errors.ts
export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Business Logic
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  CART_NOT_FOUND = 'CART_NOT_FOUND',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### 5.2 GraphQL Error Formatting

```typescript
// libs/utils/src/error-formatter.ts
import { GraphQLFormattedError } from 'graphql';
import { AppError, ErrorCode } from '@libs/shared-types';

export function formatError(error: GraphQLFormattedError): GraphQLFormattedError {
  // Log full error details server-side
  console.error('GraphQL Error:', {
    message: error.message,
    path: error.path,
    locations: error.locations,
    extensions: error.extensions
  });

  // Don't expose internal errors to clients
  if (error.extensions?.code === ErrorCode.INTERNAL_ERROR) {
    return {
      message: 'An internal error occurred',
      extensions: {
        code: ErrorCode.INTERNAL_ERROR
      }
    };
  }

  return error;
}
```

---

## 6. Testing Strategy

### 6.1 Testing Pyramid

```
┌─────────────────┐
│  E2E Tests      │ ← Few, critical user journeys
├─────────────────┤
│ Integration     │ ← GraphQL operations, DB interactions
├─────────────────┤
│ Unit Tests      │ ← Business logic, utilities, resolvers
└─────────────────┘
```

### 6.2 Test Types by Service

#### Unit Tests
```typescript
// Example: Pricing service unit test
// apps/subgraphs/pricing/src/resolvers/__tests__/product.test.ts
import { resolvers } from '../product';
import { createMockContext } from '../../__mocks__/context';

describe('Product.currentPrice resolver', () => {
  it('should return formatted price for product', async () => {
    const mockContext = createMockContext();
    mockContext.dataSources.pricing.getPrice.mockResolvedValue({
      amount: 1599,
      currency: 'TRY'
    });

    const result = await resolvers.Product.currentPrice(
      { id: 'product-1' },
      {},
      mockContext
    );

    expect(result).toEqual({
      amount: 1599,
      currency: 'TRY',
      formatted: '₺15.99'
    });
  });
});
```

#### Integration Tests
```typescript
// Example: Order service integration test
// apps/subgraphs/order/src/__tests__/create-order.integration.test.ts
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from '../schema';
import { resolvers } from '../resolvers';

describe('createOrder mutation', () => {
  let server: ApolloServer;

  beforeEach(() => {
    server = new ApolloServer({
      schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
      // ... test configuration
    });
  });

  it('should create order from valid cart', async () => {
    const CREATE_ORDER = `
      mutation CreateOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
          id
          status
          totalAmount {
            amount
            currency
          }
        }
      }
    `;

    const response = await server.executeOperation({
      query: CREATE_ORDER,
      variables: {
        input: {
          cartId: 'test-cart-id',
          shippingAddress: {
            street: '123 Test St',
            city: 'Istanbul',
            country: 'TR',
            postalCode: '34000'
          }
        }
      },
      contextValue: {
        userId: 'test-user-id'
      }
    });

    expect(response.body).toMatchObject({
      kind: 'single',
      singleResult: {
        data: {
          createOrder: {
            id: expect.any(String),
            status: 'PENDING',
            totalAmount: {
              amount: expect.any(Number),
              currency: 'TRY'
            }
          }
        }
      }
    });
  });
});
```

---

## 7. Local Development Setup

### 7.1 Prerequisites

```bash
# Install required tools
brew install postgresql@17
brew install mongodb-community
brew install redis

# Install Node.js and pnpm
nvm use 20
corepack enable
pnpm install
```

### 7.2 Database Setup

```bash
# PostgreSQL setup
createdb ecommerce_identity
createdb ecommerce_pricing  
createdb ecommerce_inventory
createdb ecommerce_order
createdb ecommerce_payment
createdb ecommerce_shipping

# MongoDB setup
mongosh
> use ecommerce_catalog
> use ecommerce_cart

# Redis setup (runs on default port 6379)
redis-server
```

### 7.3 Environment Configuration

```bash
# .env.local
# Database URLs
DATABASE_URL_IDENTITY="postgresql://localhost:5432/ecommerce_identity"
DATABASE_URL_PRICING="postgresql://localhost:5432/ecommerce_pricing"
DATABASE_URL_INVENTORY="postgresql://localhost:5432/ecommerce_inventory"
DATABASE_URL_ORDER="postgresql://localhost:5432/ecommerce_order"
DATABASE_URL_PAYMENT="postgresql://localhost:5432/ecommerce_payment"
DATABASE_URL_SHIPPING="postgresql://localhost:5432/ecommerce_shipping"

MONGODB_URL_CATALOG="mongodb://localhost:27017/ecommerce_catalog"
MONGODB_URL_CART="mongodb://localhost:27017/ecommerce_cart"

REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-dev-jwt-secret-change-in-production"
JWT_EXPIRES_IN="7d"

# Service Ports
PORT_IDENTITY=4001
PORT_CATALOG=4002
PORT_PRICING=4003
PORT_INVENTORY=4004
PORT_CART=4005
PORT_ORDER=4006
PORT_PAYMENT=4007
PORT_SHIPPING=4008

# Apollo Router
APOLLO_ROUTER_PORT=4000
APOLLO_ROUTER_SUPERGRAPH_PATH="./supergraph.graphql"
```

### 7.4 Development Commands

```bash
# Run all services in development
pnpm dev

# Run individual service
pnpm dev:identity
pnpm dev:catalog

# Database migrations
pnpm migrate:identity
pnpm migrate:pricing

# Generate GraphQL types
pnpm codegen

# Compose supergraph
pnpm compose

# Run tests
pnpm test
pnpm test:watch
pnpm test:e2e
```

---

## 8. Performance & Monitoring

### 8.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Product List (20 items) | P95 ≤ 200ms | Apollo Studio |
| Product Detail | P95 ≤ 150ms | Apollo Studio |
| Add to Cart | P95 ≤ 100ms | Apollo Studio |
| Checkout (Create Order) | P95 ≤ 500ms | Apollo Studio |

### 8.2 DataLoader Implementation

```typescript
// Example: Product price DataLoader
// apps/subgraphs/pricing/src/data-sources/price-loader.ts
import DataLoader from 'dataloader';
import { Money } from '@libs/shared-types';

export class PriceLoader {
  private loader: DataLoader<string, Money>;

  constructor(private db: Database) {
    this.loader = new DataLoader(
      async (productIds: readonly string[]) => {
        const prices = await this.db.query(`
          SELECT product_id, amount, currency 
          FROM product_prices 
          WHERE product_id = ANY($1)
        `, [productIds]);

        // Ensure order matches input order
        return productIds.map(id => 
          prices.find(p => p.product_id === id) || null
        );
      },
      {
        cache: true,
        maxBatchSize: 100
      }
    );
  }

  async load(productId: string): Promise<Money | null> {
    return this.loader.load(productId);
  }

  async loadMany(productIds: string[]): Promise<(Money | null)[]> {
    return this.loader.loadMany(productIds);
  }
}
```

---

## 9. CI/CD Pipeline

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      mongodb:
        image: mongo:7
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Run migrations
        run: pnpm migrate:all
        
      - name: Run tests
        run: pnpm test:ci
      
      - name: Generate GraphQL types
        run: pnpm codegen
      
      - name: Compose supergraph
        run: pnpm compose
        
      - name: Build
        run: pnpm build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Deploy to staging
        run: echo "Deploy to staging environment"
        
  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        run: echo "Deploy to production environment"
```

---

## 10. Migration Strategy

### 10.1 Database Migrations

```typescript
// libs/database/src/migration-runner.ts
import { Client } from 'pg';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

export class MigrationRunner {
  constructor(private client: Client, private migrationsPath: string) {}

  async runMigrations(): Promise<void> {
    // Create migrations table if it doesn't exist
    await this.client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get executed migrations
    const { rows: executed } = await this.client.query(
      'SELECT filename FROM migrations ORDER BY filename'
    );
    const executedFiles = new Set(executed.map(row => row.filename));

    // Get all migration files
    const files = await readdir(this.migrationsPath);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Execute pending migrations
    for (const file of migrationFiles) {
      if (!executedFiles.has(file)) {
        console.log(`Executing migration: ${file}`);
        
        const sql = await readFile(join(this.migrationsPath, file), 'utf-8');
        await this.client.query(sql);
        
        await this.client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        );
        
        console.log(`Migration completed: ${file}`);
      }
    }
  }
}
```

---

## 11. Deployment Architecture

### 11.1 Production Environment

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Load Balancer  │────│  Apollo Router   │────│    Subgraphs        │
│   (nginx/ALB)   │    │   (Container)    │    │  (8 Containers)     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │                            │
                              │                    ┌──────────────┐
                              │                    │  PostgreSQL  │
                              │                    │  (RDS/Cloud) │
                              │                    │              │
                              │                    │   MongoDB    │
                              │                    │ (Atlas/Cloud)│
                              │                    │              │
                              │                    │    Redis     │
                              │                    │(ElastiCache) │
                              │                    └──────────────┘
                              │
                       ┌─────────────────┐
                       │   Monitoring    │
                       │ (Grafana/APM)   │
                       └─────────────────┘
```

This Technical Design Document provides the detailed implementation guidance needed to build the e_commerce_constellation project. It complements the PRD by focusing on the technical "how" while the PRD focuses on the business "what" and "why".
