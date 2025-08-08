# E‑Ticaret Platformu — Apollo Federation v2 + Nx Monorepo

> Amaç: Apollo **Federation v2** ile mikroservis tabanlı e‑ticaret. Monorepo (Nx), CI/CD (GitHub Actions), Docker (opsiyonel), **ORM kullanmadan** Postgres (pg) + MongoDB. Frontend: Next.js.

![status-badges](https://img.shields.io/badge/status-WIP-blue)

---

## İçindekiler

* [Hızlı Başlangıç (TL;DR)](#hızlı-başlangıç-tldr)
* [Mimari Genel Bakış](#mimari-genel-bakış)
* [Teknoloji Yığını & Kararlar](#teknoloji-yığını--kararlar)
* [Ön Koşullar](#ön-koşullar)
* [Kurulum (Sprint 0)](#kurulum-sprint-0)

  * [Monorepo (Nx)](#monorepo-nx)
  * [Subgraph İskeletleri](#subgraph-iskeletleri)
  * [Supergraph Kompozisyonu (Rover)](#supergraph-kompozisyonu-rover)
  * [Apollo Router’ı Çalıştırma](#apollo-routerı-çalıştırma)
  * [Next.js İstemcisi](#nextjs-istemcisi)
  * [Kod Üretimi (GraphQL Codegen)](#kod-üretimi-graphql-codegen)
* [Veritabanları](#veritabanları)

  * [PostgreSQL 17 — Yerel Kurulum (Önerilen)](#postgresql-17--yerel-kurulum-önerilen)
  * [MongoDB — Yerel](#mongodb--yerel)
  * [Docker Compose (opsiyonel)](#docker-compose-opsiyonel)
* [Dizin Yapısı](#dizin-yapısı)
* [Script’ler](#scriptler)
* [MVP Kapsamı](#mvp-kapsamı)
* [Veri Sahipliği & Contribution](#veri-sahipliği--contribution)
* [CI/CD](#cicd)
* [Gözlemlenebilirlik, Güvenlik, Performans](#gözlemlenebilirlik-güvenlik-performans)
* [Cursor & AI Agent İpuçları](#cursor--ai-agent-ipuçları)
* [Yol Haritası](#yol-haritası)
* [SSS & Sorun Giderme](#sss--sorun-giderme)
* [Lisans](#lisans)

---

## Hızlı Başlangıç (TL;DR)

Bu dosyayı **README.md** olarak repo köküne kaydet → commit & push:

```bash
git add README.md
git commit -m "docs: add project readme"
git push origin main
```

Ardından pnpm ve Nx ile iskeleti kur:

```bash
# pnpm aktif et
corepack enable
corepack prepare pnpm@9 --activate

# Nx monorepo başlat
pnpm dlx create-nx-workspace@latest . \
  --preset=ts \
  --nxCloud=false \
  --packageManager=pnpm \
  --name=ecommerce-federation

# Eklentiler ve temel paketler
pnpm add -D @nx/node @nx/next @nx/js typescript ts-node-dev eslint prettier @types/node
pnpm add graphql @apollo/server @apollo/subgraph graphql-tag
```

Devamı için aşağıdaki adımları takip et.

---

## Mimari Genel Bakış

* **Router**: Apollo Router (Rust) tek giriş noktası.
* **Subgraph’lar (MVP)**: `identity`, `catalog`, `pricing`, `inventory`, `cart`, `order`, `payment`, `shipping`.
* **Frontend**: Next.js (React) + Apollo Client.
* **DB**: Postgres 17 (İlişkisel), MongoDB (Katalog için doküman). **ORM yok**, doğrudan `pg` ve `mongosh/mongoose`.
* **Paketleme**: Nx monorepo; paylaşılan tipler (codegen), ortak config.

### Basit akış diyagramı

```mermaid
flowchart LR
  C[Client/Next.js] --> R[Apollo Router]
  R --> CAT[Catalog]
  R --> PRI[Pricing]
  R --> INV[Inventory]
  R --> CRT[Cart]
  R --> ORD[Order]
  R --> PAY[Payment]
  R --> SHP[Shipping]
```

---

## Teknoloji Yığını & Kararlar

* **GraphQL Federasyonu**: V2 direktifleri; `@key`, `@external`, `extend type`, gerektiğinde `@requires/@provides`.
* **Neden GraphQL, REST yerine?** UI’ye **tek endpoint**; parça parça alan seçimi; federasyon ile domain sınırları. Dezavantaj: Gateway/Router karmaşıklığı, N+1 riskleri → DataLoader + caching.
* **Apollo Router**: performans ve kompozisyon cache desteği; persisted queries.
* **ORM Yok**: Postgres ile **ham SQL** + `pg`; MongoDB ile `mongosh`/`mongoose`. Amaç: SQL becerisini artırmak.
* **Caching**: Router seviyesinde persisted queries; subgraph düzeyinde kısa TTL cache.
* **Auth**: JWT doğrulama Router’da; context olarak `userId` geçişi.

---

## Ön Koşullar

* Node.js ≥ 20, pnpm ≥ 9 (veya npm/yarn; **pnpm önerilir**)
* Docker & Docker Compose (opsiyonel, lokal DB yerine kullanılabilir)
* GitHub hesabı (CI/CD için)

### pnpm kurulumu (macOS)

```bash
corepack enable
corepack prepare pnpm@9 --activate
pnpm -v
# Alternatif: brew install pnpm
```

---

## Kurulum (Sprint 0)

### Monorepo (Nx)

```bash
mkdir ecommerce-federation && cd ecommerce-federation
pnpm dlx create-nx-workspace@latest . \
  --preset=ts \
  --nxCloud=false \
  --packageManager=pnpm \
  --name=ecommerce-federation
pnpm add -D @nx/node @nx/next @nx/js typescript ts-node-dev eslint prettier @types/node
pnpm add graphql @apollo/server @apollo/subgraph graphql-tag
```

### Subgraph İskeletleri

```bash
pnpm nx g @nx/node:application subgraphs-catalog --directory=apps/subgraphs --bundler=esbuild --framework=none --strict=true
pnpm nx g @nx/node:application subgraphs-pricing --directory=apps/subgraphs --bundler=esbuild --framework=none --strict=true
# (Inventory, Cart, Order, Payment, Shipping aynı şekilde)
```

Root `package.json` script’leri (öneri):

```json
{
  "scripts": {
    "dev:catalog": "nx run subgraphs-catalog:serve:development",
    "dev:pricing": "nx run subgraphs-pricing:serve:development",
    "dev:all": "run-p dev:*",
    "build": "nx run-many -t build",
    "lint": "nx run-many -t lint",
    "typecheck": "tsc -b"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

### Supergraph Kompozisyonu (Rover)

`supergraph.yaml`:

```yaml
federation_version: 2
subgraphs:
  catalog:
    routing_url: http://localhost:4001/graphql
    schema:
      file: apps/subgraphs/catalog/schema.graphql
  pricing:
    routing_url: http://localhost:4002/graphql
    schema:
      file: apps/subgraphs/pricing/schema.graphql
```

Kompozisyon (Docker ile rover):

```bash
docker run --rm -v "$(pwd)":/work -w /work ghcr.io/apollographql/rover:latest \
  supergraph compose --config supergraph.yaml > supergraph.graphql
```

### Apollo Router’ı Çalıştırma

```bash
docker run --rm -p 4000:4000 \
  -v "$(pwd)/supergraph.graphql:/dist/supergraph.graphql" \
  ghcr.io/apollographql/router:latest \
  -s /dist/supergraph.graphql
```

Test:

```bash
curl -X POST http://localhost:4000/ \
  -H 'content-type: application/json' \
  --data '{"query":"{ products { id title currentPrice { amount } } }"}'
```

### Next.js İstemcisi

```bash
pnpm nx g @nx/next:application web --style=css --no-interactive
pnpm add -C apps/web @apollo/client graphql
```

`.env.local` (web):

```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000
```

Basit sorgu (apps/web/app/page.tsx):

```tsx
'use client'
import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Products { products { id title currentPrice { amount currency } } }
`

export default function Page() {
  const { data, loading, error } = useQuery(QUERY)
  if (loading) return <div>Loading...</div>
  if (error) return <pre>{String(error)}</pre>
  return (
    <ul>
      {data.products.map((p: any) => (
        <li key={p.id}>{p.title} — {p.currentPrice.amount} {p.currentPrice.currency}</li>
      ))}
    </ul>
  )
}
```

### Kod Üretimi (GraphQL Codegen)

```bash
pnpm add -D -w @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
pnpm add -D -C apps/web @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

Root `codegen.server.yml`:

```yaml
schema: ./supergraph.graphql
generates:
  libs/shared-types/src/generated/server-types.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      useTypeImports: true
```

Web `apps/web/codegen.yml`:

```yaml
schema: http://localhost:4000
documents: "apps/web/**/*.{ts,tsx,graphql}"
generates:
  apps/web/src/generated/client-types.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
```

Script’ler:

```json
{
  "scripts": {
    "codegen:server": "graphql-codegen --config codegen.server.yml",
    "codegen:web": "graphql-codegen --config apps/web/codegen.yml"
  }
}
```

---

## Veritabanları

### PostgreSQL 17 — Yerel Kurulum (Önerilen)

Postgres app (macOS) veya `brew services` ile çalıştır. `psql` ile kullanıcı/DB oluştur:

```sql
-- psql postgres
CREATE ROLE ecom WITH LOGIN PASSWORD 'ecom' CREATEDB;
CREATE DATABASE ecom_app OWNER ecom;
\c ecom_app
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- opsiyonel
```

`.env` (root):

```
DATABASE_URL=postgresql://ecom:ecom@localhost:5432/ecom_app
MONGO_URL=mongodb://127.0.0.1:27017/ecom_catalog
```

`sql/pricing/001_init.sql`:

```sql
CREATE TABLE IF NOT EXISTS product_price (
  product_id TEXT PRIMARY KEY,
  amount     INTEGER NOT NULL,
  currency   TEXT NOT NULL DEFAULT 'TRY'
);
INSERT INTO product_price (product_id, amount, currency)
VALUES ('p1', 1999, 'TRY')
ON CONFLICT (product_id) DO NOTHING;
```

Komut:

```bash
psql "$DATABASE_URL" -f sql/pricing/001_init.sql
```

Subgraph Postgres bağlantısı (apps/subgraphs/pricing/src/db.ts):

```ts
import pg from 'pg'
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
```

Resolver örneği (apps/subgraphs/pricing/src/main.ts):

```ts
const resolvers = {
  Product: {
    currentPrice: async (ref: { id: string }) => {
      const { rows } = await pool.query(
        'SELECT amount, currency FROM product_price WHERE product_id=$1',
        [ref.id]
      )
      return rows[0] || { amount: 0, currency: 'TRY' }
    }
  }
}
```

### MongoDB — Yerel

```bash
mongosh --eval "db.version()"
# ilk bağlantıda DB kendiliğinden oluşur
mongosh --eval "use ecom_catalog"
```

### Docker Compose (opsiyonel)

Yereldeki Postgres/Mongo yerine konteyner kullanmak istersen `docker-compose.yml`:

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongodata:/data/db]
  redis:
    image: redis:7
    ports: ["6379:6379"]
volumes:
  pgdata: {}
  mongodata: {}
```

---

## Dizin Yapısı

```
apps/
  router/
  subgraphs/
    catalog/
    pricing/
    inventory/
    cart/
    order/
    payment/
    shipping/
  web/
libs/
  shared-types/
  graphql-fragments/
  utils/
sql/
  pricing/
    001_init.sql
```

---

## Script’ler

```bash
pnpm dev:catalog        # Catalog subgraph dev
pnpm dev:pricing        # Pricing subgraph dev
pnpm dev:all            # Hepsini paralel (npm-run-all gerekir)
pnpm nx run-many -t build
pnpm nx graph
pnpm run codegen:server
pnpm run codegen:web
```

---

## MVP Kapsamı

* **Var**: Ürün listeleme/detay, sepet, tek ödeme yöntemi (mock/tek PSP), sipariş oluşturma/durum, basit arama, kullanıcı hesabı.
* **Yok**: Kupon, yorum/puanlama, gelişmiş filtre, kargo takip entegrasyonu, çoklu ödeme.

---

## Veri Sahipliği & Contribution

| Entity   | Owner    | Contributors                                                  |
| -------- | -------- | ------------------------------------------------------------- |
| Product  | Catalog  | Pricing (`currentPrice`), Inventory (`inStock`, `stockLevel`) |
| Category | Catalog  | —                                                             |
| User     | Identity | Order (read), Payment (read)                                  |
| Cart     | Cart     | Catalog (read), Pricing (opsiyonel hesap)                     |
| Order    | Order    | Payment (`paymentStatus`), Shipping (`shippingFee`)           |
| Payment  | Payment  | —                                                             |
| Shipment | Shipping | Order (read)                                                  |

---

## CI/CD

* **CI** (PR & main push): lint + build + unit test + **supergraph compose** (artifact olarak yüklenir).
* **CD** (opsiyonel): Docker imajlarını GHCR’a push; staging → prod (manual approve, canary).
* **Kompozisyon kontrolleri**: Subgraph şemaları değişince kompozisyon hatalarını erken yakala.

GitHub Actions örneği `.github/workflows/ci.yml` (özet):

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm nx run-many -t lint build
      - run: docker run --rm -v "$PWD":/work -w /work ghcr.io/apollographql/rover:latest \
              supergraph compose --config supergraph.yaml > supergraph.graphql
      - uses: actions/upload-artifact@v4
        with: { name: supergraph, path: supergraph.graphql }
```

---

## Gözlemlenebilirlik, Güvenlik, Performans

* **Tracing**: OpenTelemetry; Router W3C context’i geçirir.
* **Logs**: Pino JSON; **Metrics**: Prom-client (/metrics, Prometheus)
* **Auth**: JWT doğrulama Router’da; subgraph’lara context ile kullanıcı bilgisi.
* **N+1**: DataLoader her subgraph’ta; gerekirse field-level cache.
* **Validation**: zod/yup ile input doğrulama.

---

## Cursor & AI Agent İpuçları

* Prompt kalıbı:

  > You are a senior TypeScript backend architect. Follow Nx & Apollo Federation best practices. Output only code diffs for files you modify, and list new files separately. If unsure, ask before assuming schema fields. Do not invent env vars; read .env.\* files.

* Akış: test yazdır → refactor → type narrowing → e2e smoke.

---

## Yol Haritası

* **S1**: Inventory & Cart (inStock katkısı, sepet akışı)
* **S2**: Order & Payment (mock PSP), checkout
* **S3**: Observability + caching + security sertleştirme
* **Sonraki**: Elasticsearch arama, kuponlar, kargo entegrasyonu, çoklu ödeme

---

## SSS & Sorun Giderme

* **EADDRINUSE 4001/4002**: Portu kullanan süreçleri kapat veya PORT değiştir.
* **Postgres bağlantı hatası**: `DATABASE_URL` doğru mu? Postgres app açık mı? `psql "$DATABASE_URL" -c "select 1"` ile test et.
* **Rover izni**: Docker çalışıyor mu? `docker run hello-world` ile kontrol.
* **CORS**: Router’a uygun CORS başlıkları ekle veya dev’de proxy kullan.

---

## Lisans

MIT (veya uygun gördüğün lisans).
