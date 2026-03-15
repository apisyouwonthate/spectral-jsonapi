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
      delete: {
        responses: {
          "404": {
            description: "not found",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].delete.responses["204"] = {
  description: "no content",
};

testRule("delete-2xx-response-codes", [
  {
    name: "delete has no success 2xx response",
    document: invalidDocument,
    errors: [
      {
        message:
          "DELETE operations must define at least one success response: 200, 202, or 204.",
        path: ["paths", "/articles/{id}", "delete", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid delete-2xx-response-codes case",
    document: validDocument,
    errors: [],
  },
]);
