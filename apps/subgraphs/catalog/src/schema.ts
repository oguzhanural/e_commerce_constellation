import gql from 'graphql-tag';

export const typeDefs = gql`
  extend schema
  @link(url: "https://specs.apollo.dev/federation/v2.11", import: ["@key", "@shareable", "@override", "@inaccessible", "@tag", "@authenticated", "@requiresScopes", "@policy", "@connector"])

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
    products(search: String, categoryId: ID): [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
  }
`;
