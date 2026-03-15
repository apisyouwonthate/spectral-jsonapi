import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("relationship-schema", [
  {
    name: "relationship entry missing links data and meta",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            relationships: {
              type: "object",
              properties: {
                author: {
                  type: "object",
                  properties: {},
                },
              },
            },
          },
        },
      },
    }),
    errors: [
      {
        message:
          "Each relationship object must include links, data, or meta and match JSON:API structure.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "relationship that only has links.related passes",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            relationships: {
              type: "object",
              properties: {
                comments: {
                  type: "object",
                  properties: {
                    links: {
                      type: "object",
                      properties: {
                        related: { type: "object" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    errors: [],
  },
]);
