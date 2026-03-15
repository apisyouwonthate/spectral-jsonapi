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
          "204": {
            description: "no content",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].delete.responses["404"] = {
  description: "not found",
};

testRule("delete-404-response-code", [
  {
    name: "delete missing 404 response",
    document: invalidDocument,
    errors: [
      {
        message: "DELETE operations must define a 404 response.",
        path: ["paths", "/articles/{id}", "delete", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid delete-404-response-code case",
    document: validDocument,
    errors: [],
  },
]);
