import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import 'dotenv/config';

async function startCatalogService() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const port = parseInt(process.env.PORT_CATALOG || '4002', 10);

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀 Catalog subgraph ready at ${url}`);
}

startCatalogService();
