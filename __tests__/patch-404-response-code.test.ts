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
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].patch.responses["404"] = {
  description: "not found",
};

testRule("patch-404-response-code", [
  {
    name: "patch missing 404 response",
    document: invalidDocument,
    errors: [
      {
        message: "PATCH operations must define a 404 response.",
        path: ["paths", "/articles/{id}", "patch", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid patch-404-response-code case",
    document: validDocument,
    errors: [],
  },
]);
