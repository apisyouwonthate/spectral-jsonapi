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
        parameters: [
          {
            name: "fields",
            in: "query",
            style: "form",
            schema: {
              type: "object",
            },
          },
        ],
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
validDocument.paths["/articles"].get.parameters[0].style = "deepObject";

testRule("fields-parameter", [
  {
    name: "fields incorrectly uses form style",
    document: invalidDocument,
    errors: [
      {
        message: "fields must be a query parameter using deepObject style.",
        path: ["paths", "/articles", "get", "parameters", "0", "style"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid fields-parameter case",
    document: validDocument,
    errors: [],
  },
]);
