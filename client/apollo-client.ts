import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "http://localhost:8080/graphql" });

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

const client = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});
export default client;
