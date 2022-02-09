import 'reflect-metadata';
import Cors from 'micro-cors';
import { ApolloServer, gql } from 'apollo-server-micro'
import type { PageConfig } from "next";
import { buildSchema } from 'type-graphql';
import { HelloResolver } from '../../lib/graphql/HelloResolver';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

export const config: PageConfig = {
    api: {
      bodyParser: false,
    },
  };

  const cors = Cors();


// const typeDefs = gql`
//     type Query {
//         hello: String!
//     }
// `

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [HelloResolver],
  }),
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});


const startServer = apolloServer.start();

export default cors(async (req: MicroRequest, res: ServerResponse) => {
    if (req.method === "OPTIONS") {
      res.end();
      return false;
    }
  
    await startServer;
    await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
  });
  