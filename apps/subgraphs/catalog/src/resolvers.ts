const mockProducts = [
  {
    id: 'product-1',
    slug: 'klasik-gitar',
    title: 'Klasik Gitar',
    description: 'Yeni başlayanlar için ideal, naylon telli klasik gitar.',
    categoryId: 'cat-1',
    images: [],
    createdAt: new Date().toISOString(),
    attributes: {
      brand: 'GitarMarkasi',
      weight: 1.5,
      dimensions: { length: 100, width: 40, height: 10 },
    },
  },
];

const mockCategories = [
  {
    id: 'cat-1',
    name: 'Müzik Aletleri',
    slug: 'muzik-aletleri',
    description: 'Her türlü müzik aleti',
  },
];

export const resolvers = {
  Query: {
    products: () => {
      // TODO: Connect to MongoDB to fetch products
      return mockProducts;
    },
    product: (_: any, { id }: { id: string }) => {
      // TODO: Connect to MongoDB to fetch a single product by ID
      return mockProducts.find((p) => p.id === id);
    },
    categories: () => {
      // TODO: Connect to MongoDB to fetch categories
      return mockCategories;
    },
  },
  Product: {
    __resolveReference(product: { id: string }) {
      // TODO: Connect to MongoDB to resolve product reference
      return mockProducts.find((p) => p.id === product.id);
    }
  }
};
