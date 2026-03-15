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
validDocument.paths["/articles"].get.responses["406"] = {
  description: "not acceptable",
};

testRule("406-response-code", [
  {
    name: "missing 406 response",
    document: invalidDocument,
    errors: [
      {
        message: "Document a 406 response for invalid Accept headers.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid 406-response-code case",
    document: validDocument,
    errors: [],
  },
]);
