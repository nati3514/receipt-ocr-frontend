"use client";

import {
    ApolloLink,
    HttpLink,
} from "@apollo/client";
import {
    ApolloNextAppProvider,
    NextSSRApolloClient,
    NextSSRInMemoryCache,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { createUploadLink } from "./upload-link";
import { API_ENDPOINTS } from "./config/endpoints";

function makeClient() {
    const uploadLink = createUploadLink({
        uri: API_ENDPOINTS.GRAPHQL,
        headers: {
            "Apollo-Require-Preflight": "true",
        },
    });

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    uploadLink,
                ])
                : uploadLink,
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
