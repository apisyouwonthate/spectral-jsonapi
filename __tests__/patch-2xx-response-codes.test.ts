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
          "409": {
            description: "conflict",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].patch.responses["200"] = {
  description: "ok",
};

testRule("patch-2xx-response-codes", [
  {
    name: "patch has no success 2xx response",
    document: invalidDocument,
    errors: [
      {
        message:
          "PATCH operations must define at least one success response: 200, 202, or 204.",
        path: ["paths", "/articles/{id}", "patch", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid patch-2xx-response-codes case",
    document: validDocument,
    errors: [],
  },
]);
