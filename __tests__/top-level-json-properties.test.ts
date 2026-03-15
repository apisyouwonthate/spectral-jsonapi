import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles/{id}": {
      get: {
        responses: {
          "200": {
            description: "ok",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  properties: {
                    links: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.meta = {
  type: "object",
};

testRule("top-level-json-properties", [
  {
    name: "top-level schema has links only",
    document: invalidDocument,
    errors: [
      {
        message:
          "Top-level documents must include data, errors, or meta and follow JSON:API member rules.",
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
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid top-level-json-properties case",
    document: validDocument,
    errors: [],
  },
]);
