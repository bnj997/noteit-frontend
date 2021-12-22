import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { Response } from "../generated/graphql";
import { createWithApollo } from "./createWithApollo";

const createClient = (ctx: NextPageContext | undefined) =>
  new ApolloClient({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            notes: {
              keyArgs: [],
              merge(
                existing: Response | undefined,
                incoming: Response
              ): Response {
                return {
                  ...incoming,
                  edges: [...(existing?.edges || []), ...incoming.edges],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
