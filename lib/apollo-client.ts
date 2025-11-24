import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const client = new ApolloClient({
    link: createUploadLink({
        uri: "http://localhost:4000/graphql",
        headers: {
            "Apollo-Require-Preflight": "true",
        },
    }),
    cache: new InMemoryCache(),
});

export default client;
