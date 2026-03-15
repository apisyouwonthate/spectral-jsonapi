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
      patch: {
        requestBody: {
          content: {
            "application/vnd.api+json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "ok",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].patch.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.items;
validDocument.paths["/articles/{id}"].patch.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.type = "object";

testRule("patch-requests-single-object", [
  {
    name: "patch data is incorrectly an array",
    document: invalidDocument,
    errors: [
      {
        message:
          "PATCH request data must be a single resource object, not an array.",
        path: [
          "paths",
          "/articles/{id}",
          "patch",
          "requestBody",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid patch-requests-single-object case",
    document: validDocument,
    errors: [],
  },
]);
