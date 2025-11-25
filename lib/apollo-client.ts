import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { API_ENDPOINTS } from "./config/endpoints";

const client = new ApolloClient({
    link: createUploadLink({
        uri: API_ENDPOINTS.GRAPHQL,
        headers: {
            "Apollo-Require-Preflight": "true",
        },
    }),
    cache: new InMemoryCache(),
});

export default client;
