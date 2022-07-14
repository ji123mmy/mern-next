import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({ uri: process.env.httpsUri });

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: process.env.wsUri as string,
        })
      )
    : null;

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("jwtToken");
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null,
      },
    }));
  }

  return forward(operation);
});

const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const client = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: concat(authMiddleware, splitLink),
});
export default client;
