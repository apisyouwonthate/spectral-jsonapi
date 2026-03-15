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
      put: {
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
delete validDocument.paths["/articles/{id}"].put;
validDocument.paths["/articles/{id}"].patch = {
  responses: {
    "200": {
      description: "ok",
    },
  },
};

testRule("put-disallowed", [
  {
    name: "put operation is present",
    document: invalidDocument,
    errors: [
      {
        message: "PUT is not allowed by JSON:API; use PATCH.",
        path: ["paths", "/articles/{id}", "put"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid put-disallowed case",
    document: validDocument,
    errors: [],
  },
]);
