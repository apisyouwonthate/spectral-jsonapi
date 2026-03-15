import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles": {
      get: {
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
validDocument.paths["/articles"].get.responses["403"] = {
  description: "forbidden",
};

testRule("403-response-code", [
  {
    name: "missing 403 response",
    document: invalidDocument,
    errors: [
      {
        message: "Document a 403 response for every operation.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid 403-response-code case",
    document: validDocument,
    errors: [],
  },
]);
