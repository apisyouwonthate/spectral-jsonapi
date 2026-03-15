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
                    type: "object",
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
          "409": {
            description: "conflict",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].patch.responses["409"];

testRule("patch-409-response", [
  {
    name: "patch includes explicit 409 response",
    document: invalidDocument,
    errors: [
      {
        message:
          "PATCH 409 responses should include source to explain the conflict.",
        path: ["paths", "/articles/{id}", "patch", "responses", "409"],
        severity: DiagnosticSeverity.Information,
      },
    ],
  },
  {
    name: "valid patch-409-response case",
    document: validDocument,
    errors: [],
  },
]);
