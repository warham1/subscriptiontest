import { ApolloClient, HttpLink, split } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new HttpLink({
    // uri: "http://180.69.196.84:4000",
    // uri: "http://localhost:4000",
    uri: "http://35b0571c.jp.ngrok.io",
});

const wsLink = new WebSocketLink({
    // uri: `ws://180.69.196.84:4000/`,
    // uri: "ws://localhost:4000",
    uri: "ws://35b0571c.jp.ngrok.io",
    options: {
        reconnect: true,
    },
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    // eslint-disable-next-line comma-dangle
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export default client;
