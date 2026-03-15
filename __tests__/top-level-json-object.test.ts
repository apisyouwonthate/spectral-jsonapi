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
                  type: "array",
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
].schema.type = "object";

testRule("top-level-json-object", [
  {
    name: "top-level schema is not an object",
    document: invalidDocument,
    errors: [
      {
        message:
          "Request and response bodies must have a top-level JSON object.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid top-level-json-object case",
    document: validDocument,
    errors: [],
  },
]);
